var React = require('react');
var ReactDOM = require('react-dom');
var DynamicContent = require('../../dist/react-dynamic-content.min.js');
require('../../styles/style.css');




var Image = (props) => {
  return <img style={{'border':'10px solid blue', borderWidth:'10px 10px 10px 10px'  ,  boxSizing:'border-box'    }} src=""  ></img>;
};


var PlainOnlineImage = () => {
  var height = Math.ceil(Math.random()*300)+200
  var width = Math.ceil(Math.random()*300)+200

  var decColor =
    (Math.ceil(Math.random()*16))*16*16
    +
    (Math.ceil(Math.random()*16))*16
    +
    (Math.ceil(Math.random()*16));

  var src = "http://lorempixel.com/"+width+"/"+height;

  var b1 = Math.ceil(Math.random()*25)
  var b2 = Math.ceil(Math.random()*25)
  var b3 = Math.ceil(Math.random()*25)
  var b4 = Math.ceil(Math.random()*25)


  return <img
    style={{'border':'10px solid  ', 'borderColor':'orange yellow',    borderWidth:`${b1}px ${b2}px ${b3}px ${b4}px`,  margin:'0.5%',  boxSizing:'border-box'    }}
    src={src}  ></img>;
};




var OnlineImage3D = () => {


  var height = Math.ceil(Math.random()*300)+200
  var width = Math.ceil(Math.random()*300)+200


  var decColor =
    (Math.ceil(Math.random()*16))*16*16
    +
    (Math.ceil(Math.random()*16))*16
    +
    (Math.ceil(Math.random()*16));


  var hexString = (decColor).toString(16);

  var hexInvertedString = (  1*16*16*16 -   decColor).toString(16);

  var img = "http://lorempixel.com/"+width+"/"+height;

  return <div className="flip-container">
    <img className="hiddenFrame" src={img} ></img>
    <div className="flipper">
      <img className="front" src={img}></img>
      <div className="back">
        {width} - {height}
      </div>
    </div>
  </div>;
};








var isMouseDown=false;
const swipe = (e=>{
  isMouseDown = (e.type==="mousedown" || e.type==="touchstart")
    ?true:((e.type==="mouseup" || e.type==="touchend")?false:isMouseDown);
  if((e.type==="mousemove" || e.type==="touchmove") && isMouseDown){
    return new Promise((resolve, reject)=> setTimeout(()=>resolve(true), 600));
  }
});

const longclick = (e=>{
  if(e.type==="mousedown" || e.type==="touchstart"){
    return new Promise((resolve, reject)=> setTimeout(()=>resolve(true), 600));
  }
});

var lastClick=0;
const dblclick = ((e,ind)=>{
  if(e.type==="mousedown" || e.type==="touchstart"){
    if(new Date() - lastClick <400){
      return true;
    }
    lastClick=new Date();
  }
});

const click = (e=>e.type==="mousedown" || e.type ==="touchstart");
























var video = (link) => {
  return <div className="video">
    <img src="imgs/move.png" className="dragHandle"/>
    <iframe width="100%" height="100%" src={link}></iframe>
  </div>;
};


var aspRatioContent = (percent,elm) => {
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

var Content = React.createClass({
  getInitialState: function () {
    var elements = [];





    elements.push(video("https://www.youtube.com/embed/vO2Su3erRIA"));
    elements.push(video("https://www.youtube.com/embed/kszLwBaC4Sw"));
    elements.push(video("https://www.youtube.com/embed/pUncXbXAiV0"));
    elements.push(video("https://www.youtube.com/embed/5zmIrFDksUM"));
    elements.push(video("https://www.youtube.com/embed/PN0RPWII7gY"));


    elements.push(<img className="imgBorderMd" src="http://lorempixel.com/300/400"/>);
    elements.push(<img src="http://lorempixel.com/100/200"/>);
    elements.push(<img className="imgBorderLg" src="http://lorempixel.com/300/200"/>);
    elements.push(<img src="http://lorempixel.com/400/500"/>);
    elements.push(<img className="imgBorderSm" src="http://lorempixel.com/500/600"/>);


    elements.push(aspRatioContent(70,text('Id et mauris pellentesque aliquam, justo aenean dolor tortor consectetuer id consequat, imperdiet lectus vestibulum')))
    elements.push(aspRatioContent(70,text('Lorem ipsum dolor sit amet, dignissim non arcu tempus, accumsan et, venenatis aenean, vitae molestiae ligula vivamus morbi dictum, semper scelerisque amet rutrum felis tempus nullam.')))
    elements.push(aspRatioContent(70,text('Eleifend metus vitae urna felis eu ac, sociis consequat magna neque vel, enim at lectus vestibulum dolor. Eu porttitor lorem aliquet sociosqu quisque. Malesuada wisi dapibus nec porttitor aenean, sodales class erat torquent eu dis ut, sapien nunc ac vestibulum, vestibulum non fringilla erat hac. Integer massa sagittis luctus tortor. Mauris massa in libero, ipsum metus, nec pretium minus. Viverra quis wisi varius morbi orci, leo felis cum. Cras purus urna diam velit mauris, lacinia morbi suscipit. Voluptatem eget mi morbi hymenaeos, lectus quis dui felis convallis nec sed. Pariatur morbi sagittis curabitur dictum, conubia molestie,')))


    /*

    elements.push(<div className="captionImg">
      <img src="https://placehold.it/300x200"/>
      <div className="cover"><div className="captionImgTxt">Image Caption</div></div>
    </div>)


    elements.push(<img className="imgBorderLg" style={{margin:'1%'}}   src="test.jpeg"/>)

    elements.push(<img className="imgBorderMd" src="http://lorempixel.com/130/300"/>)


    elements.push(OnlineImage3D())

    elements.push(<img className="imgBorderSm" src="http://lorempixel.com/400/500"/>)

    elements.push(OnlineImage3D())
    elements.push(<img className="imgBorderMd" src="http://lorempixel.com/440/200"/>)
    elements.push(<img className="imgBorderMd" src="http://lorempixel.com/130/300"/>)
    elements.push(OnlineImage3D())
    elements.push(<img className="imgBorderSm" src="http://lorempixel.com/400/500"/>)

*/










    return {
      elements:elements,
      layoutToggle:true
    }
  },

  render: function() {
        return (
          <div>
            <button
              className="switchBtn"
              onClick={()=>{
                this.setState({
                    layoutToggle:!this.state.layoutToggle
                })
            }}>switch to {this.state.layoutToggle?"google images":"cascading"} layout</button>
            <div className="contentWrapper" >
              <DynamicContent
                elements={this.state.elements}
                onChange={elements=>{}}
                allowDraggingMobile={true}
                allowDraggingDesktop={true}
                //confirmElementDrag={swipe}
                //confirmElementDrag={dblclick}
                //confirmElementDrag={longclick}
                confirmElementDrag={click}
                layout={this.state.layoutToggle?"cascading":"images"}
                //numOfColumns={6}
                columnWidth={250}
                maxHeight={250}
                verticalMargin={10}
                horizontalMargin={10}></DynamicContent>
            </div>
          </div>
        );
    }
});
ReactDOM.render(<Content />, document.getElementById('content'));
