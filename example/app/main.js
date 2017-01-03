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




var Content = React.createClass({

  getInitialState: function () {

    var elements = [];

    //for(var i=0;i<20;i++){
    //  elements.push(PlainOnlineImage())
    //
    //}


    //elements.push(
    //
    //  <div style={{border:'3px solid red'}}>
    //
    //    <iframe width="90%" height='100%' src="https://www.youtube.com/embed/XGSy3_Czz8k"></iframe>
    //  </div>
    //
    //)

    //"http://lorempixel.com/"+width+"/"+height;

    /*

    elements.push(<div className="captionImg">
      <img src="https://placehold.it/300x200"/>
      <div className="cover"><div className="captionImgTxt">Image Caption</div></div>
    </div>)


    elements.push(<img className="imgBorder3" style={{margin:'1%'}}   src="test.jpeg"/>)

    elements.push(<img className="imgBorder2" src="http://lorempixel.com/130/300"/>)


    elements.push(OnlineImage3D())

    elements.push(<img className="imgBorder1" src="http://lorempixel.com/400/500"/>)

    elements.push(OnlineImage3D())

    elements.push(<img className="imgBorder2" src="http://lorempixel.com/440/200"/>)

    elements.push(<img className="imgBorder2" src="http://lorempixel.com/130/300"/>)

    elements.push(OnlineImage3D())


    elements.push(<img className="imgBorder1" src="http://lorempixel.com/400/500"/>)



    elements.push(<div className="aspRatioContent"  style={{margin:'1%',   boxSizing:'content-box'}}>
      <div className="texxt">lorem ipsum...</div>
    </div>)

    */

    elements.push(<img src="https://placehold.it/300x200"/>)
    elements.push(<img src="https://placehold.it/200x250"/>)
    elements.push(<img src="https://placehold.it/600x240"/>)
    elements.push(<img src="https://placehold.it/300x500"/>)
    elements.push(<img src="https://placehold.it/300x400"/>)
    elements.push(<img src="https://placehold.it/500x200"/>)
    elements.push(<img src="https://placehold.it/300x200"/>)
    elements.push(<img src="https://placehold.it/200x250"/>)
    elements.push(<img src="https://placehold.it/600x240"/>)
    elements.push(<img src="https://placehold.it/300x500"/>)
    elements.push(<img src="https://placehold.it/300x400"/>)
    elements.push(<img src="https://placehold.it/500x200"/>)


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

            }} >switch to {this.state.layoutToggle?"google images":"cascading"} layout</button>


            <div className="contentWrapper" >
              <DynamicContent
                elements={this.state.elements}

                allowDraggingMobile={true}
                allowDraggingDesktop={true}

                onChange={elements=>{

                        //this.setState({elements})
                    }}

                //confirmElementDrag={swipe}
                //confirmElementDrag={dblclick}
                //confirmElementDrag={longclick}
                confirmElementDrag={click}

                layout={this.state.layoutToggle?"cascading":"images"}

                //numOfColumns={6}
                columnWidth={150}
                maxHeight={250}

                verticalMargin={10}
                horizontalMargin={10}

                ></DynamicContent>
            </div>





          </div>
        );
    }
});
ReactDOM.render(<Content />, document.getElementById('content'));
