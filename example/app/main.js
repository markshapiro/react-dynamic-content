var React = require('react');
var ReactDOM = require('react-dom');
var DynamicContent = require('../../dist/react-dynamic-content.min.js');
require('../../styles/style.css');

var video = (link) => {
  return <div className="video">
    <img src="imgs/move.png" className="dragHandle"/>
    <iframe width="100%" height="100%" src={link}></iframe>
  </div>;
};

var aspRatioContent = (percent,elm, clsName) => {

  return <div className="aspRatioContent">
    <div className="filler" style={{ paddingTop:percent+'%' }}></div>
    {elm}
  </div>;
};

var text = (text) => {
  return <div className="contentText">
    <div style={{margin:'15px 20px'}}>{text}</div>
  </div>;
};


var slidingImg = (src)=>{
  return <div className="captionImg">
    <img src={src}/>
    <div className="cover"><div className="captionImgTxt">Image Caption</div></div>
  </div>
}


class LoadingImg extends React.Component {
  constructor(props) {
    super(props);
    this.state={visible:false};
    setTimeout(()=>{
      this.setState({src:"http://lorempixel.com/100/75"})
    },1);
  }

  render() {
    return aspRatioContent(75, <div>
      <div className="loadingBg">deferred loading example</div>
      <img className="withLoader" style={{visibility:this.state.visible?'visible':'hidden', border:'',  width:'100%', position:'absolute',left:'0px', top:'0px'}} onLoad={()=>{
        setTimeout(()=>this.setState({visible:true}),5000)
     }} src={this.state.src}/></div>)
  }
}

var randomBorder = (src)=>{

  var b1 = Math.ceil(Math.random()*30)
  var b2 = Math.ceil(Math.random()*30)
  var b3 = Math.ceil(Math.random()*30)
  var b4 = Math.ceil(Math.random()*30)

  return <img style={{'border':'10px solid red',    borderColor:'orange yellow',    borderWidth:`${b1}px ${b2}px ${b3}px ${b4}px`}} src={src}/>
};

const mousedown = e=>e.type==="mousedown" || e.type ==="touchstart";

var lastClick=0;
const clickAndHold = (e,ind)=>{
  if(e.type==="mousedown" || e.type==="touchstart"){
    if(new Date() - lastClick <400){ return true; }
    lastClick=new Date();
  }
};

const longHold = e=>{
  if(e.type==="mousedown" || e.type==="touchstart"){
    return new Promise((resolve, reject)=> setTimeout(()=>resolve(true), 600));
  }
};

var isMouseDown=false;
const swipe = e=>{
  isMouseDown = (e.type==="mousedown" || e.type==="touchstart")
    ?true:((e.type==="mouseup" || e.type==="touchend")?false:isMouseDown);
  if((e.type==="mousemove" || e.type==="touchmove") && isMouseDown){
    return new Promise((resolve, reject)=> setTimeout(()=>resolve(true), 400));
  }
};

var dragConfirmations = [mousedown, clickAndHold, longHold, swipe,];

var dragConfirmationsNames = ["mousedown", "click & hold", "long hold",  "swipe",];

var Content = React.createClass({
  getInitialState: function () {
    var elements = [];



    elements.push(randomBorder("https://placeholdit.imgix.net/~text?txtsize=120&txtclr=3498db&bg=9b59b6&txt=RANDOM%20BORDER&w=380&h=600&txttrack=0"))
    elements.push(randomBorder("https://placeholdit.imgix.net/~text?txtsize=120&txtclr=3498db&bg=9b59b6&txt=RANDOM%20BORDER&w=480&h=500&txttrack=0"))
    elements.push(randomBorder("https://placeholdit.imgix.net/~text?txtsize=120&txtclr=3498db&bg=9b59b6&txt=RANDOM%20BORDER&w=480&h=550&txttrack=0"))

    elements.push(slidingImg("http://lorempixel.com/300/400"))
    elements.push(slidingImg("http://lorempixel.com/200/150"))
    elements.push(slidingImg("http://lorempixel.com/500/700"))




    elements.push(<LoadingImg></LoadingImg>);
    elements.push(<LoadingImg></LoadingImg>);
    elements.push(<LoadingImg></LoadingImg>);

    elements.push(<img className="imgBorderMd" src="http://lorempixel.com/300/400"/>);


    elements.push(video("https://www.youtube.com/embed/vO2Su3erRIA"));
    elements.push(video("https://www.youtube.com/embed/kszLwBaC4Sw"));
    elements.push(video("https://www.youtube.com/embed/pUncXbXAiV0"));
    elements.push(video("https://www.youtube.com/embed/5zmIrFDksUM"));

    elements.push(<img className="imgBorderMd" src="http://lorempixel.com/300/400"/>);
    elements.push(<img src="http://lorempixel.com/100/200"/>);
    elements.push(<img className="imgBorderLg" src="http://lorempixel.com/300/200"/>);
    elements.push(<img src="http://lorempixel.com/400/500"/>);
    elements.push(<img className="imgBorderSm" src="http://lorempixel.com/500/600"/>);


    elements.push(aspRatioContent(70,text('Id et mauris pellentesque aliquam, justo aenean dolor tortor consectetuer id consequat, imperdiet lectus vestibulum')))
    elements.push(aspRatioContent(70,text('Lorem ipsum dolor sit amet, dignissim non arcu tempus, accumsan et, venenatis aenean, vitae molestiae ligula vivamus morbi dictum, semper scelerisque amet rutrum felis tempus nullam.')))
    elements.push(aspRatioContent(70,text('Eleifend metus vitae urna felis eu ac, sociis consequat magna neque vel, enim at lectus vestibulum dolor. Eu porttitor lorem aliquet sociosqu quisque. Malesuada wisi dapibus nec porttitor aenean, sodales class erat torquent eu dis ut, sapien nunc ac vestibulum, vestibulum non fringilla erat hac. Integer massa sagittis luctus tortor. Mauris massa in libero, ipsum metus, nec pretium minus. Viverra quis wisi varius morbi orci, leo felis cum. Cras purus urna diam velit mauris, lacinia morbi suscipit. Voluptatem eget mi morbi hymenaeos, lectus quis dui felis convallis nec sed. Pariatur morbi sagittis curabitur dictum, conubia molestie,')))


    return {
      elements:elements,
      layoutToggle:true,
      dragConfIndex:0
    }
  },

  render: function() {
        return (
          <div>



            <span className="currentDrags">

              currently starting drags with {dragConfirmationsNames[(this.state.dragConfIndex)%dragConfirmations.length]}


              <button className="switchBtn"  onClick={()=>{
                  this.setState({
                      dragConfIndex:(this.state.dragConfIndex+1)%dragConfirmations.length
                  });
              }}>switch to {dragConfirmationsNames[(this.state.dragConfIndex+1)%dragConfirmations.length]}</button>



              <button className="switchBtn"  onClick={()=>{
                  this.setState({
                      layoutToggle:!this.state.layoutToggle
                  })
              }}>switch to {this.state.layoutToggle?"google images":"cascading"} layout</button>


            </span>



            <div className="contentWrapper" >
              <DynamicContent
                elements={this.state.elements}
                onChange={elements=>{}}
                allowDraggingMobile={true}
                allowDraggingDesktop={true}
                layout={this.state.layoutToggle?"cascading":"images"}
                numOfColumns={4}
                //columnWidth={250}
                maxHeight={250}
                confirmElementDrag={dragConfirmations[this.state.dragConfIndex]}
                verticalMargin={10}
                horizontalMargin={10}></DynamicContent>
            </div>
          </div>
        );
    }
});
ReactDOM.render(<Content />, document.getElementById('content'));
