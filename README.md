# React Dynamic Content

## Live Demo
Live demo: [`__DEMO_LINK__`](__DEMO_LINK__)

![demo gif](__GIF_LINK__)

React dynamic content is a React component to organize custom html content using layouts and reposition by dragging.

Features of `react-dynamic-content`
* Support for any kind of content and not just images (can be text, video, complex elements)
* Organization using "cascading" or "google images" layouts that **resize** elements to fit rows or columns
* Customization of layout method (you can provide you own layout positioning method)
* Elements reposition from place to place using mouse/touch drags
* Customization of drag initiation (for exampe if you want drag start with long click/swipe)
* Mobile friendly

**NOTE #1**: it is recomended that you provide responsive content, and if you plan using "google images" layout then please provide content that maintains aspect ratio within inner width/height (client width/height), for example plain `<img>`, you can still provide any margins/borders you want regardless of aspect ratio.

**NOTE #2**: the component does not include scroller but only content, you can wrap it in your own one.

### Getting Started

```bash
npm install --save react-dynamic-content
```

### Style import

```
import "react-dynamic-content/styles/style.css";    //for css
import "react-dynamic-content/styles/style.scss";   //for scss
import "react-dynamic-content/styles/style.less";   //for less
```

### Example

```jsx
import DynamicContent from 'react-dynamic-content';
import "react-dynamic-content/styles/style.css"; 

class MyComponent extends React.Component {
  render() {
    const content = [
      <img src="http://lorempixel.com/1000/600" />,
      
      <img src="http://lorempixel.com/500/550" />,
      
      <div style={{background:'white', fontSize:'22px', padding:'10px', 
      border:'2px solid grey', borderRadius:'15px'}}>
        Lorem ipsum dolor sit amet, melius consequat mea te. His dicat suscipit sadipscing an.
        Probo saepe eu vix. Nam cu clita deserunt.
        Cum et choro solet quodsi. Unum temporibus sit id. Eam fierent conclusionemque cu,
        ei euismod moderatius interpretaris nec, te movet nullam tincidunt vis.
      </div>,
      
      <img src="http://lorempixel.com/1000/1200" />,
      
      <iframe src={"https://www.youtube.com/embed/vO2Su3erRIA"}></iframe>,
      
      <img src="http://lorempixel.com/600/500" />
    ]

    return (
      <DynamicContent
        elements={content}
        layout={'cascading'}
        numOfColumns={3}
        allowDraggingMobile={true}
        allowDraggingDesktop={true}/>
    );
  }

}
```



## Options

Property	|	Type		|	Default		|	Description
:-----------------------|:--------------|:--------------|:--------------------------------
aaaa	|	bool	|	false	| bbbbb
ccccc	|	bool	|	false	| dddd
