var React = require('react');
var ReactDOM = require('react-dom');

var DynamicContent = require('../../dist/react-dynamic-content.min.js');

require('../../styles/style.css');



var colors=['green','yellow', 'pink','black','grey', 'magenta', 'cyan', 'purple', 'violet', 'orange','blue', 'pink', 'red'];


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

  var b1 = Math.ceil(Math.random()*20)
  var b2 = Math.ceil(Math.random()*20)
  var b3 = Math.ceil(Math.random()*20)
  var b4 = Math.ceil(Math.random()*20)

  var col = colors[  Math.floor(colors.length * Math.random())  ];

  return <img
    style={{'border':'10px solid '+col,    borderWidth:`${b1}px ${b2}px ${b3}px ${b4}px`,  margin:'0.5%',  boxSizing:'border-box'    }}
    src={src}  ></img>;
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

    for(var i=0;i<20;i++){
      elements.push(<PlainOnlineImage></PlainOnlineImage>)
    }

    return {
      elements:elements,
      layoutToggle:false
    }
  },

  render: function() {
        return (
          <div>
            <section style={{position:'relative', background:'lightgrey', width:'80%', height:'700px', left:'60px',  'WebkitOverflowScrolling': 'touch', top:'30px' ,display:'inline-block', overflow:'scroll'}} >
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

                numOfColumns={5}
                //columnWidth={100}
                maxHeight={150}

                verticalMargin={0}
                horizontalMargin={0}

                ></DynamicContent>
            </section>

            <button onClick={()=>{


                this.setState({
                    layoutToggle:!this.state.layoutToggle
                })

            }} style={{verticalAlign:'top'}}>switch</button>



          </div>
        );
    }
});
ReactDOM.render(<Content />, document.getElementById('content'));
