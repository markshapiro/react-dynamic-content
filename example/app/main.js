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
    <div className="filler" style={{ paddingTop:(percent*100)+'%' }}></div>
    {elm}
  </div>;
};

var text = (text) => {
  return <div className="contentText">
    <div style={{margin:'15px 20px', fontSize:'20px'}}>{text}</div>
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
      this.setState({src:props.src})
    },1);
  }

  render() {
    return aspRatioContent(this.props.aspRatio, <div>
      <div className="loadingBg">deferred loading example</div>
      <img className="withLoader" style={{visibility:this.state.visible?'visible':'hidden', border:'',  width:'100%', position:'absolute',left:'0px', top:'0px'}} onLoad={()=>{
        setTimeout(()=>this.setState({visible:true}),6000)
     }} src={this.state.src}/></div>)
  }
}

var randomBorder = (src)=>{

  var b1 = Math.ceil(Math.random()*10)
  var b2 = Math.ceil(Math.random()*40)
  var b3 = Math.ceil(Math.random()*20)
  var b4 = Math.ceil(Math.random()*30)

  return <img style={{'border':'10px solid red',    borderColor:'red blue',    borderWidth:`${b1}px ${b2}px ${b3}px ${b4}px`}} src={src}/>
};

const mousedown = e=>e.type==="mousedown" || e.type ==="touchstart";

var lastClick=0;
const clickAndMouseDown = (e,ind)=>{
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

var dragConfirmations = [mousedown, clickAndMouseDown, longHold, swipe,];

var dragConfirmationsNames = ["mousedown", "click & mousedown", "long hold",  "swipe",];

var Content = React.createClass({
  getInitialState: function () {
    var elements = [];

    elements.push(<img className="imgBorderSm" src="imgs/1.jpg"/>);
    elements.push(<LoadingImg aspRatio={200/400} src={"imgs/6.jpg"}></LoadingImg>);
    elements.push(video("https://www.youtube.com/embed/pUncXbXAiV0"));
    elements.push(aspRatioContent(0.8,text('Eleifend metus vitae urna felis eu ac, sociis consequat magna neque vel, enim at lectus vestibulum dolor. Eu porttitor lorem aliquet sociosqu quisque. Malesuada wisi dapibus nec porttitor aenean, sodales class erat torquent eu dis ut, sapien nunc ac vestibulum, vestibulum non fringilla erat hac. Integer massa sagittis luctus tortor. Mauris massa in libero, ipsum metus, nec pretium minus. Viverra quis wisi varius morbi orci, leo felis cum. Cras purus urna diam velit mauris, lacinia morbi suscipit. Voluptatem eget mi morbi hymenaeos, lectus quis dui felis convallis nec sed. Pariatur morbi sagittis curabitur dictum, conubia molestie,')));
    elements.push(<img className="imgBorderMd" src="imgs/11.jpg"/>);
    elements.push(video("https://www.youtube.com/embed/kszLwBaC4Sw"));
    elements.push(<img className="imgBorderLg" src="imgs/8.jpg"/>);
    elements.push(<LoadingImg aspRatio={194/259}  src={"imgs/5.jpg"}></LoadingImg>);
    elements.push(slidingImg("imgs/2.jpg"));
    elements.push(aspRatioContent(0.5,text('Id et mauris pellentesque aliquam, justo aenean dolor tortor consectetuer id consequat, imperdiet lectus vestibulum')));
    elements.push(<LoadingImg aspRatio={225/225} src={"imgs/4.jpg"}></LoadingImg>);
    elements.push(<img src="imgs/7.jpg"/>);
    elements.push(<img className="imgBorderMd" src="imgs/10.jpg"/>);
    elements.push(video("https://www.youtube.com/embed/5zmIrFDksUM"));
    elements.push(aspRatioContent(0.55,text('Lorem ipsum dolor sit amet, dignissim non arcu tempus, accumsan et, venenatis aenean, vitae molestiae ligula vivamus morbi dictum, semper scelerisque amet rutrum felis tempus nullam.')));
    elements.push(randomBorder("imgs/r1.png"));
    elements.push(<LoadingImg aspRatio={454/600} src={"imgs/3.jpg"}></LoadingImg>);
    elements.push(slidingImg("imgs/9.jpg"));
    elements.push(video("https://www.youtube.com/embed/vO2Su3erRIA"));
    elements.push(randomBorder("imgs/r2.png"));
    elements.push(aspRatioContent(0.65,text('Eleifend metus vitae urna felis eu ac, sociis consequat magna neque vel, enim at lectus vestibulum dolor. Eu porttitor lorem aliquet sociosqu quisque. Malesuada wisi dapibus nec porttitor aenean, sodales class erat torquent eu dis ut, sapien nunc ac vestibulum, vestibulum non fringilla erat hac. Integer massa sagittis luctus tortor. Mauris massa in libero, ipsum metus, nec pretium minus. Viverra quis wisi varius morbi orci, leo felis cum. Cras purus urna diam velit mauris, lacinia morbi suscipit. Voluptatem eget mi morbi hymenaeos, lectus quis dui felis convallis nec sed. Pariatur morbi sagittis curabitur dictum, conubia molestie,')));
    elements.push(slidingImg("imgs/12.jpg"));

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
              }}>switch to {dragConfirmationsNames[(this.state.dragConfIndex+1)%dragConfirmations.length]} to drag</button>



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
                numOfColumns={5}
                //columnWidth={250}
                maxHeight={180}
                confirmElementDrag={dragConfirmations[this.state.dragConfIndex]}
                verticalMargin={10}
                horizontalMargin={10}></DynamicContent>
            </div>
          </div>
        );
    }
});
ReactDOM.render(<Content />, document.getElementById('content'));
