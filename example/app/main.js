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
      <div className="loadingBg"></div>
      <img className="withLoader" style={{visibility:this.state.visible?'visible':'hidden', border:'',  width:'100%', position:'absolute',left:'0px', top:'0px'}} onLoad={()=>{
        setTimeout(()=>this.setState({visible:true}),5000)
     }} src={this.state.src}/></div>)
  }
}





var Content = React.createClass({
  getInitialState: function () {
    var elements = [];



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
