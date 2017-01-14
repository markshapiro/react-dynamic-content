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
confirmElementDrag | function |	starts drags after<br/> mousedown/touchstart | no | method to provide confirmation for drag to customize drag start<br/>see [`Providing custom drag initiator`](/#providing-custom-drag-initiator)
allowDraggingMobile |	bool |	false	| no | ability to drag elements in desktop
allowDraggingDesktop | bool |	false	| no  | ability to drag elements in mobile

## Providing custom layout method



```js
  /**
    arguments:
      elements: object of keys and values: key = index of element from `"elements"` array, value = rendered element for element at this index
      props: relevant props to assist you with organizing: maxHeight, numOfColumns, columnWidth, verticalCellSpacing, horizontalCellSpacing
  */
  customLayoutMethod (elements, props){
    //you should provide css styles top, left, width or height or both for each each element for each value of elements obj
    //you can see implementations for `cascading` and `images` layouts in `/src/utils.js`
    ...
  }
```

## Providing custom drag initiator

if you want your own way to start dragging elements (long click, swipe, double click, drag by handle element ...) you should implement `confirmElementDrag`:

```js
  /**
    arguments:
      event: event fired on element, can be mousedown, mousemove, mouseup, and same with touchevents
      index: index of clicked element from `'elements'` array
    output:
      true or NOT true (false/null/undefined), or deferred promise that yields the same.
  */
  confirmElementDrag (event, index){
    ...
    return result;
  }
```

to understand how to implement it to serve your needs, consider stream of results of confirmElementDrag(event) on each mouse/touch event fired on your elements,
such that if confirmElementDrag returned deferred promise then the result will be also deferred and may be yielded after immediate confirmElementDrag results of events that came after current event.
A false result of confirmElementDrag cancels any true results that came before, even if deferred.
once a drag started, it can be canceled only with mouseup/touchstart event that comes after the drag initiation, regardless of confirmElementDrag implementation.
this is a bit complicated but once understood it can simplify the implementation. 

lets see examples:

a drag resulting from mousedown/touchstart (which is also the default setting) will be:

```js
  //returns true if mosuedown or touchstart and starts dragging immediately
  const press = (e, index) => e.type === "mousedown" || e.type === "touchstart";
   <DynamicContent
      ...
      confirmElementDrag={press}
      ...
      ></DynamicContent>
```

a drag resulting from long press (600ms press) will be:

```js 
  const longpress = (e, index) => {
    if(e.type === "mousedown" || e.type === "touchstart"){
      return new Promise((resolve, reject) => {
        setTimeout(()=>resolve(true), 600)
      });
    }
    //same as returning false here, will cancel out the previous promise and prevent drag if press was not long enough (600ms)
  };
   <DynamicContent
      ...
      confirmElementDrag={longpress}
      ...
      ></DynamicContent>
```

a drag resulting from simplified swipe (400ms continuous mousemove after mousedown) will be:

```js 
  const swipe = (e, index) =>{
    if(e.type !== "mouseup" && e.type !== "touchend"){
      return new Promise((resolve, reject) => {
        setTimeout(()=>resolve(true), 400)
      });
    }
    //else if event = mouseup/touchend, will cancel out the previous promise and prevent drag if swipe was not long enough (400ms)
  };
   <DynamicContent
      ...
      confirmElementDrag={swipe}
      ...
      ></DynamicContent>
```

a drag resulting from click and then press, with less than 400ms interval, will be:

```js 
  var lastClickTime=0;
  const clickAndPress = (e, index) => {
    //first mosuedown/touchstart time will be remembered, second will trigger drag if interval less than 400ms
    if(e.type === "mousedown" || e.type === "touchstart"){
      if(new Date() - lastClickTime < 400){ return true; }
      lastClickTime = new Date();
    }
  };
   <DynamicContent
      ...
      confirmElementDrag={clickAndPress}
      ...
      ></DynamicContent>
```

you can use e.target to detect sub-element in case you want to drag by handle
