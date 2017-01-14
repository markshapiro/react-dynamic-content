React Dynamic Content
===

## Live Demo
Live demo: [`react-dynamic-content-31776.bitballoon.com`](http://react-dynamic-content-31776.bitballoon.com)

![demo gif](http://react-dynamic-content-31776.bitballoon.com/imgs/sample.gif)

React dynamic content is a component to organize custom html content using layouts and reposition by dragging.

Features of `react-dynamic-content`
* Content organization using "cascading" or "google images" layouts that **resize** elements to fit columns and rows
* Support for any kind of content and not just images (can be text, video, complex elements)
* Customization of layout method (you can provide your own layout positioning method)
* Changing order of elements by moving them with mouse/touch events, and receiving callback with new setting
* Customization of drag initiation (for example if you want to start drag with swipe or long click)
* Mobile friendly

**NOTE #1**: it is recomended that you provide responsive content, and if you plan using "google images" layout then please provide content that maintains aspect ratio within inner width/height (client width/height), for example plain `<img>`, you can still provide any margins/borders you like regardless of aspect ratio.

**NOTE #2**: the component does not include scroller, only renders content, you can wrap it into scroller.

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

Property|Type|Default|mandatory|Description
:-------|:---|:------|:--------|:----------
elements | array | null | yes | input of elements to display, **must be array of react elements**
layout | string | null  | yes | name of layout method:<br/>`"cascading"` for cascading,<br/>`"images"` for google images,<br/>`"custom"` to provide your own layout method with `"customLayoutMethod"`
customLayoutMethod | bool |	null | only if layout=`"custom"` | custom layout method when layout=`"custom"`<br/>see [`Providing custom layout method`](/#providing-custom-layout-method)
numOfColumns | number |	null | only if layout=`"cascading"`<br/>AND columnWidth absent | num of columns for `"cascading"` layout
columnWidth |	number |	null | only if layout=`"cascading"`<br/>AND numOfColumns absent | column width for `"cascading"` layout
maxHeight |	number | null	| only if layout=`"images"` | max height of row for `"images"` layout
horizontalCellSpacing | number |	0 | no | horizontal spacing between elements
verticalCellSpacing | number |	0 | no | vertical spacing between elements
onChange | function|	null | no | this method is called with new order setting of `"elements"` array once some element is reordered after being moved with drag
confirmElementDrag | function |	null | no | method to provide confirmation for drag to customize drag start<br/>see [`Providing custom drag initiator`](/#providing-custom-drag-initiator)
allowDraggingMobile |	bool |	false	| no | ability to drag elements in desktop
allowDraggingDesktop | bool |	false	| no  | ability to drag elements in mobile

## Providing custom layout method



## Providing custom drag initiator

