import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import _ from 'lodash';
import * as utils from './utils';
import update from 'react-addons-update';
import Rx from 'rx';
import $ from 'jquery';
require('jquery.waitforimages');

const mouseUp$ = Rx.Observable.merge(
    Rx.Observable.fromEvent(document, "mouseup"),
    Rx.Observable.fromEvent(document, "touchend")),
  mouseMoves$ = Rx.Observable.merge(
    Rx.Observable.fromEvent(document, "mousemove"),
    Rx.Observable.fromEvent(document, "touchmove")
      .map(e=>_.extend(e,e.touches[0])));

const imgState={
  PENDING:        'PENDING',          //pending to start loading (not queued for loading yet)
  LOADING:        'LOADING',          //loading (invisible) (before onLoad or onError call)
  FAILED:         'FAILED',           //failed to load (after onError call)
  NOT_POSITIONED: 'NOT_POSITIONED',   //loaded (and still invisible) but not positioned yet (directly after onLoad call)
  FINISHED:       'FINISHED'          //final phase (positioned and is should be displayed)
};

const LOADING_QUEUE_SIZE = 15;        //max num of elements loading simultaneously (loading from top to bottom)

const repositionMethods = {           //resize & reposition methods for each layout option
  cascading: utils.repositionCascadingLayout,
  images:utils.repositionImagesLayout
};

const propsThatTriggerRender = ["layout", "numOfColumns","columnWidth","maxHeight","verticalMargin","horizontalMargin"];
const propsPassed2positionMethods = ["maxHeight","numOfColumns","columnWidth","verticalMargin","horizontalMargin"];

class WrappingElement{
  constructor(elm){
    this.elm=elm;
    this.ref = _.uniqueId();
    this.state = imgState.PENDING;
    this._renderedElm = new Promise((resolve, reject)=>{
      this._resolveRenderedElm = resolve;
    });
  }
  assignRenderedElm(elm){
    this._resolveRenderedElm(elm);
    this.renderedElmResult=elm;
  }
  getRenderedElm(){
    return this._renderedElm;
  }
  isPresent(){
    return this.state===imgState.FINISHED || this.state===imgState.NOT_POSITIONED;
  }
  isVisible(){
    return this.state===imgState.FINISHED;
  }
}

class InlineElement extends Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
    this.props.elmData.getRenderedElm().then(elm=>{
      var failed=false;
      $(elm).waitForImages({
        each: function(loaded, count, success) {
          if(!success){
            failed=true
          }
        },
        finished: ()=>failed?this.props.onError():this.props.onLoad(),
        waitForAll: true
      });
      elm.addEventListener("mouseup", this.props.onEventDesktop);
      elm.addEventListener("mousemove", this.props.onEventDesktop);
      elm.addEventListener("mousedown", this.props.onEventDesktop);
      elm.addEventListener("touchstart", this.props.onEventMobile);
      elm.addEventListener("touchmove", this.props.onEventMobile);
      elm.addEventListener("touchend", this.props.onEventMobile);
    });
  }
  shouldComponentUpdate(nextProps, nextState){
    if(!this.renderedOnce){
      this.renderedOnce=true;
      return true;
    }
    return false;
  }
  componentWillReceiveProps(nextProps){
    this.props.elmData.getRenderedElm().then(elm=>{
      var newClassList = nextProps.className.trim().split(/\s+/g);
      ['forceVisible','autoTransition','draggingMode','fadeIn'].forEach(cname=>elm.classList
        .toggle(cname, newClassList.indexOf(cname)>=0));
    });
  }
  render() {
    return this.props.elmData.elm;
  }
}

class DynamicContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data:[]
    };
  }
  static propTypes = {
    elements: React.PropTypes.array,
    layout: React.PropTypes.string,
    customLayoutMethod: React.PropTypes.func,
    numOfColumns: React.PropTypes.number,
    columnWidth: React.PropTypes.number,
    maxHeight: React.PropTypes.number,
    verticalMargin: React.PropTypes.number,
    horizontalMargin: React.PropTypes.number,
    onChange: React.PropTypes.func,
    confirmElementDrag: React.PropTypes.func,
    allowDraggingMobile: React.PropTypes.bool,
    allowDraggingDesktop: React.PropTypes.bool,
    custom: function(props) {
      if(props.layout==="cascading" && props.numOfColumns === undefined && props.columnWidth === undefined){
        return new Error('either numOfColumns or columnWidth required with "cacading" layout');
      }
      if(props.layout==="images" && props.maxHeight === undefined){
        return new Error('maxHeight required with "images" layout');
      }
      return props.elements.reduce((prev, curr)=>{
        if(!React.isValidElement(curr)){
          return new Error('"elements" prop arr must have only react elements')
        }
        return prev;
      }, undefined);
    }
  };

  elmLoaded$ = new Rx.Subject();          //streams of elements loadings (onLoad) successes or failures
  elmEvent$ = new Rx.Subject();           //stream of mouse/tap events on elements
  initialCss = {};                        //initial css of elements, to revert back before layout switch

  componentWillMount(){
    //stream of sequences of loaded element refs
    const nextLoadedElements$ =  this.elmLoaded$
      .scan((acc,elm)=>acc.concat(elm),[])
      .map(arr=>this.getFirstLoadedElements(arr))
      .filter(arr=>arr.length)
      .shareReplay(1);

    //flow of making loaded elements visible and queuing next elements for to loading queue
    nextLoadedElements$
      .buffer(nextLoadedElements$.debounce(150))  //nextLoadedElements$ debounced and buffered
      .map(arrs=>_.uniq(_.flatten(arrs)))
      .map(arr=>this.setElementsStateAferLoaded(this.state.data, arr, imgState.NOT_POSITIONED, imgState.FAILED))
      .map(data=>this.queueNext(data))
      .subscribe(data=>this.setState({data}));

    //stream of results of confirmElementDrag(event) applied on events from this.elmEvent$
    const event2resultOfConfirmDrag$ = this.elmEvent$
      .do(({e})=>e.preventDefault())
      .map(({e, ref})=> {
        var elmDataIndex = _.findIndex(this.state.data,elm=>elm.ref===ref);
        return {
          data:{ e:_.extend({}, e), ref },
          res:(this.props.confirmElementDrag || (e=>e.type ==="mousedown" || e.type ==="touchstart"))(e, elmDataIndex)
        };
      })
      .shareReplay(1);

    //stream for dragging elements after drag confirmation received
    event2resultOfConfirmDrag$
      .startWith({res:false})
      //first we need to receive confirmation
      .flatMap(({data, res})=>(utils.isPromise(res)
        ?Rx.Observable.fromPromise(res
        .then(promRes=>({data, res:promRes}))
        .catch(()=>false))
        :Rx.Observable.from([{data, res}]))
        //all later results (that were pushed after) should cancel all deferring (promise) results that were pushed before
        .takeUntil(event2resultOfConfirmDrag$
          .flatMap(({data, res})=>utils.isPromise(res)
            ?Rx.Observable.fromPromise(res
            .catch(()=>false))
            :Rx.Observable.from([res]))
          .filter(x=>!x)))
      .pairwise()
      .filter(arr=>!arr[0].res && arr[1].res)
      .map(arr=>arr[1])
      .do(({data})=>this.onElementDown(data))
      .flatMap(({data})=>mouseMoves$
        .do(e=>this.onElementMove(e, data))
        .takeUntil(mouseUp$
          .withLatestFrom(mouseMoves$.startWith(data.e),(upEvt, mvEvt)=>mvEvt)
          .do(data=>this.onElementDrop(data))))
      .subscribe(()=>{});

    var data = this.props.elements.map(el=>new WrappingElement(el));
    this.setState({data:this.queueNext(data)});
  }

  onElementDown(data){
    var elmDataIndex = _.findIndex(this.state.data,elm=>elm.ref===data.ref);
    var initOffset = utils.getWindowOffset(this.findDOMNode(data.ref));
    data.initOffset=initOffset;
    this.setState({
      data:update(this.state.data,{
        [elmDataIndex]:{isDragging:{$set:true}}
      })
    });
  }

  //forcefully place element under cursor to prevent misplacement in case of scroll change or delay
  onElementMove(evt, data){
    var elm = this.findDOMNode(data.ref);
    var currOffset = utils.getWindowOffset(elm);
    var diffX = currOffset.left - data.initOffset.left - ( evt.clientX - data.e.clientX );
    var diffY = currOffset.top - data.initOffset.top - ( evt.clientY - data.e.clientY );
    elm.style.left = (elm.offsetLeft - diffX)+"px";
    elm.style.top = (elm.offsetTop - diffY)+"px";
  }

  onElementDrop(evt){
    if(_.findIndex(this.state.data,elm=>elm.isDragging)===-1){return;}
    var elmInd = _.findIndex(this.state.data,elm=>elm.isDragging),
      elmRecent = this.state.data[elmInd], data = this.state.data, otherRef=null;
    _.each(this.state.data, elm=>{
      if(!elm.isDragging && elm.isVisible()){
        var offs = utils.getWindowOffset(elm.renderedElmResult);
        if(elm.renderedElmResult.offsetHeight+offs.top>evt.clientY && offs.top<evt.clientY
          && elm.renderedElmResult.offsetWidth+offs.left>evt.clientX && offs.left<evt.clientX){
          otherRef=elm.ref;
        }
      }
    });
    if(otherRef) {
      data = update(data, {
        $splice: [[elmInd, 1]]
      });
      var maxElmInd = _.findIndex(data, el=>el.ref === otherRef);
      data = update(data, {
        $splice: [[maxElmInd, 0, elmRecent]]
      });
    }
    var newElmInd = _.findIndex(data,elm=>elm.isDragging);
    data = update(data,{
      [newElmInd]:{isDragging:{$set:false}}
    });
    elmRecent.renderedElmResult.classList.toggle('draggingMode',false);
    elmRecent.renderedElmResult.classList.toggle('autoTransition',true);
    this.setState({data});
    if(otherRef && this.props.onChange){
      this.props.onChange(data.map(w=>w.elm));
    }
  }

  getFirstLoadedElements(arr) {
    var result=[];
    _.takeWhile(this.state.data, (elm,ind)=> {
      if(elm.state!==imgState.LOADING){
        return true;
      }
      var data = _.find(arr, d=>d.ref===this.state.data[ind].ref);
      if (data) {
        result.push(data);
      }
      return data;
    });
    return result;
  }

  queueNext(data){
    var current = _.filter(data, e=>e.state==imgState.LOADING).length
    var toQueueSize = LOADING_QUEUE_SIZE - current;
    var updateStatement={};
    _.takeWhile(data, (elm,ind)=>{
      if(elm.state===imgState.PENDING){
        toQueueSize--;
        updateStatement[ind]={state:{$set:imgState.LOADING}}
      }
      return toQueueSize;
    });
    return update(data, updateStatement);
  }

  setElementsStateAferLoaded(data, arr, successState, failedState){
    var updateStatement={};
    _.each(arr, elm=>{
      var index = _.findIndex(data, e=>e.ref === elm.ref);
      if(index>=0 && elm.success && successState){
        updateStatement[index]={state:{$set:successState}};
      }
      else if(index>=0 && failedState){
        updateStatement[index]={state:{$set:failedState}};
      }
    });
    return update(data, updateStatement);
  }

  reposition() {
    var wrapper = findDOMNode(this.refs.wrapper), renderedElms={},
      props = _.extend({ parentWidth: wrapper.offsetWidth }, _.pick(this.props, propsPassed2positionMethods));
    this.state.data
      .forEach((elmData, elmInd)=> {
        if(elmData.isPresent() && !elmData.isDragging){
          renderedElms[elmInd] = elmData.renderedElmResult;
        }
      });
    if(this.props.layout!=='custom'){
      repositionMethods[this.props.layout](renderedElms, props);
    }
    else{
      this.props.customLayoutMethod(renderedElms, props);
    }
    this.makeNotPositionedFinished();
  }

  makeNotPositionedFinished() {
    var updateStatement = {};
    this.state.data
      .forEach((elmData, elmInd)=> {
        if(elmData.isPresent() && !elmData.isDragging){
          if(elmData.state===imgState.NOT_POSITIONED){
            updateStatement[elmInd]={
              state:{$set:imgState.FINISHED},
              startRenderAt:{$set:new Date()}
            };
            setTimeout(()=>this.state.data[elmInd].renderedElmResult.classList.toggle('autoTransition',true),1)
          }
        }
      });
    if(_.keys(updateStatement).length>0){
      this.setState({data: update(this.state.data, updateStatement)});
    }
  }

  repositionThrottled = _.throttle(this.reposition, 100);
  repositionDebounced = _.debounce(this.reposition, 100);

  findDOMNode(ref){
    var elm = _.find(this.state.data,elm=>elm.ref===ref);
    return elm && elm.renderedElmResult;
  }

  render() {
    console.debug("render");
    return <div ref="wrapper" className="CustomContentWrapper">{
      this.state.data
        .filter(elm=>elm.state!==imgState.PENDING)
        .map((elm,index)=><InlineElement elmData={elm} key={elm.ref}
                                         onLoad={()=>this.elmLoaded$.onNext({ref:elm.ref, success:true})}
                                         onError={()=>this.elmLoaded$.onNext({ref:elm.ref, success:false})}
                                         onEventDesktop={e=>this.elmEventDesktop(e, elm)}
                                         onEventMobile={e=>this.elmEventMobile(e, elm)}
                                         className={`${ elm.isVisible() && 'forceVisible' }
                                ${ (new Date() - elm.startRenderAt<1000) && 'fadeIn' }
                                ${ elm.isDragging
                                ? 'draggingMode'
                                : (new Date() - elm.startRenderAt > 200) && 'autoTransition' }`}>
        </InlineElement>)}</div>;
  }

  componentWillReceiveProps(nextProps){
    if(!_.isEqual(this.props.elements, nextProps.elements)){
      var data = nextProps.elements.map(elm=> {
        var found = _.find(this.state.data, elm2=>elm2.elm===elm);
        return found?found:new WrappingElement(elm);
      });
      this.setState({data:this.queueNext(data)});
    }
  }

  componentDidUpdate(prevProps, prevState){
    if(this.shouldReposition(prevProps, prevState)){
      if(this.props.layout!==prevProps.layout){   //if layout switch then reset height/width to initial
        this.state.data
          .filter(elm=>elm.isVisible())
          .forEach(({ref})=>{
            var elm = this.findDOMNode(ref)
            elm.style.height = this.initialCss[ref].height;
            elm.style.width = this.initialCss[ref].width;
            elm.style.position = this.initialCss[ref].position;
          });
      }
      this.repositionThrottled();
    }
    this.assignRenderedElms();
  }

  assignRenderedElms(){
    var children = findDOMNode(this.refs.wrapper).children;
    this.state.data
      .filter(elm=>elm.state!==imgState.PENDING)
      .forEach((elmData, ind)=>{
        if(!elmData.renderedElmResult){
          elmData.assignRenderedElm(children[ind]);
          this.initialCss[elmData.ref]={
            height:children[ind].style.height,
            width:children[ind].style.width,
            position:children[ind].style.position
          };
        }
      });
  }

  elmEventDesktop(e, elm){
    this.props.allowDraggingDesktop? this.elmEvent$.onNext({e, ref:elm.ref}) : null;
  }

  elmEventMobile(e, elm){
    this.props.allowDraggingMobile? this.elmEvent$.onNext({e:_.extend(e,e.touches[0]), ref:elm.ref}) : null;
  }

  shouldReposition(prevProps, prevState){
    var should=false;
    _.each(prevState.data, (elmData, ind)=>{
      should = should  ||
        (   this.state.data[ind]
          && (this.state.data[ind].ref !== prevState.data[ind].ref
          || (this.state.data[ind].state !== prevState.data[ind].state
          && !( prevState.data[ind].state===imgState.NOT_POSITIONED
          && this.state.data[ind].state===imgState.FINISHED ) )
          || (this.state.data[ind].isDragging !== prevState.data[ind].isDragging))
        ) || !this.state.data[ind];
    });
    should = should || prevState.data.length !== this.state.data.length
      || !_.isEqual(_.pick(prevProps, propsThatTriggerRender), _.pick(this.props, propsThatTriggerRender));
    console.debug("shouldReposition : ",should);
    return should;
  }

  componentDidMount () {
    this.assignRenderedElms();
    if( typeof window !== 'undefined' ) window.addEventListener('resize', this.repositionDebounced.bind(this), false)
  }
  componentWillUnmount () {
    if( typeof window !== 'undefined' ) window.removeEventListener('resize', this.repositionDebounced.bind(this))
  }
}
export default DynamicContent;
