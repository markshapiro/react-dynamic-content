React Dynamic Content
===

## Live Demo
Live demo: [`react-dynamic-content-31776.bitballoon.com`](http://react-dynamic-content-31776.bitballoon.com)

![demo gif](http://react-dynamic-content-31776.bitballoon.com/imgs/sample.gif)

React dynamic content is a component to organize custom html content using layouts and reposition by dragging.

Features of `react-dynamic-content`
* Content organization using "cascading" or "google images" layouts that **resize** elements to fit columns and rows
* Supports any kind of content, not just images (can be text, video, complex elements)
* Customization of layout method (you can provide your own layout positioning method)
* Changing order of elements by moving them with mouse/touch events, and receiving callback with new setting
* Customization of drag initiation (for example if you want to start drag with swipe or long click)
* Mobile friendly

**NOTE #1**: it is recomended that you provide responsive content, and if you plan using "google images" layout then please provide content that maintains aspect ratio within inner width/height (client width/height) by changing width or height (both not necesary), for example plain `<img>`, you can still provide any margins/borders you like regardless of aspect ratio.

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
:-------|:---|:------|:--------|:--------------------
elements|array|null|yes|input of elements to display, **must be array of react elements**
layout|string|null|yes|name of layout method:<br/>`"cascading"` for cascading,<br/>`"images"` for google images,<br/>`"custom"` to provide your own layout method with `"customLayoutMethod"`<br/>see [`More on "cascading" and "images" layouts`](#more-on-cascading-and-images-layouts)
customLayoutMethod|bool|null|only if layout=`"custom"`|custom layout method when layout = `"custom"`<br/>see [`Providing custom layout method`](#providing-custom-layout-method)
numOfColumns|number|null|only if layout=`"cascading"`<br/>AND columnWidth absent|num of columns for `"cascading"` layout
columnWidth|number|null|only if layout = `"cascading"`<br/>AND numOfColumns absent|column width for `"cascading"` layout
maxHeight|number|null|only if layout=`"images"`|max height of row for `"images"` layout
horizontalCellSpacing|number|0|no|horizontal spacing between elements
verticalCellSpacing|number|0|no|vertical spacing between elements
onChange|function|null|no|this method is called with new order setting of `"elements"` array once some element is reordered after being moved with drag.<br/>see [`Reorder elements by dragging`](#reorder-elements-by-dragging)
confirmElementDrag|function|starts drags<br/>after mousedown<br/>/ touchstart|no|method to provide confirmation for drag to customize drag start<br/>see [`Providing custom drag initiator`](#providing-custom-drag-initiator)
allowDraggingMobile|bool|false|no|ability to drag elements in desktop
allowDraggingDesktop|bool|false|no|ability to drag elements in mobile

## More on "cascading" and "images" layouts

Both layouts organize by ordering elements by their index in `"elements"` array,
<br/><br/>**Cascading layout:** organizes elements like pinterest or tumblr do (columns with cascading images).
<br/>Element with higher index will be located lower than element with lower index, may be in any column.
<br/>It is recommended to provide responsive elements for this layout because the component resizes width to fit the columns.
<br/><br/>**Images layout:** organizes like google images, (rows with elements with same height).
<br/>For elements in the same row, element with higher index will be on the right side from elements with lower,
for elements in different rows, the element with higher index will be in lower rows.
<br/>It is recommended to provide responsive elements that maintain aspect ratio between clientWidth/clientHeight (regardless of border/margin) because the library uses the ratio to fit elements into rows without leaving trailing edges,
meaning that width change should automatically change height and maintain ratio, or opposite, the component will try resizing both ways (by width or height) and force initial ratio if both ways fail.
<br/> see [`here`](https://css-tricks.com/snippets/sass/maintain-aspect-ratio-mixin) how to make html elements that maintain raio (besides using `<img/>`'s).

## Reorder elements by dragging

Component supports reposition element by dragging (mousedown/touchstart and then move as default), make sure to enable by setting allowDraggingDesktop={'true'} or allowDraggingMobile={'true'}.
<br/>To move element to a new place after you started dragging, you must move the cursor over some other element while dragging, and release mouse/tap (trigger mouseup/touchend), then your dragged element will be pushed before the other elment in `"elements"` array, and `"onChange"` will be called with new array setting.
<br/> After this, component will be rerendered anew with current layout method.

## Providing custom layout method

If you want to provide your own layout to organizate, you should provide implementation of `confirmElementDrag`:

```js
  /**
    arguments:
      elements: object of keys and values where: 
        key = index of element from 'elements' array,
        value = mounted element (that is rendered) for element at this index
      props: relevant props passed to component to assist you with organizing:
        maxHeight, numOfColumns, columnWidth, verticalCellSpacing, horizontalCellSpacing
  */
  customLayoutMethod (elements, props){
    //you should provide css styles top, left, width or height or both
    //for each each element of each value of elements obj
    //you can see example implementations for `cascading` and `images` layouts in `/src/utils.js`
    ...
  }
```

your job here is to set css styles `left`, `top`, `width`, `height` (can specify only width or height if element is responsive),
to each element from values of `"elements"` obj, remember that component sets `position: absolute;` to all of its elements.

## Providing custom drag initiator

If you want your own way to start dragging elements (long click, swipe, double click, drag by handle element ...)<br/>you should provide implementation of `confirmElementDrag`:

```js
  /**
    arguments:
      event: event fired on element, can be mousedown, mousemove, mouseup, and same with touchevents
      index: index of clicked element from 'elements' array
    output:
      true or NOT true (false/null/undefined), or deferred promise that yields the same.
  */
  confirmElementDrag (event, index){
    ...
    return result;
  }
```

to understand how to implement it to serve your needs, consider stream (pipe) of events (like RxJS stream) fired on your elements,
then consider a new stream of results of confirmElementDrag(event,i) for each event from previous stream, such that if confirmElementDrag() returned a promise,
then the result will also be deferred, meaning if you have 2 events: A and event B that fires immediately after A,
if confirmElementDrag(A, i) returns a promise that yields after 100ms and B returns immediate result,
then confirmElementDrag(A, i) will be yielded 100ms after B in second stream.
<br>element dragging will start in either of these 2 cases:
 * confirmElementDrag(E, i) returns true immediately (does not return promise)
 * confirmElementDrag(E, i) returns deferred promise that returns true, and there was no event E2 that was fired after E
 whose confirmElementDrag(E2) yielded false, and it yielded before confirmElementDrag() of E.
 <br/>meaning false result for next events will cancel out the result of for previous events when their confirmElementDrag() results are yielded before the results of previous event
<br>

**NOTE:** once dragging has started, its can be cancelled only with mouseup/touchend, regardless of confirmElementDrag implementation

lets see some examples:

to start dragging after mousedown/touchstart (which is also the default setting):
```js
  //returns true if mosuedown or touchstart and starts dragging immediately
  const mousedown = (e, index) => e.type === "mousedown" || e.type === "touchstart";
   <DynamicContent
      ...
      confirmElementDrag={mousedown}
      ...
      ></DynamicContent>
```
to start dragging after long press (600ms press):
```js 
  const longPress = (e, index) => {
    if(e.type === "mousedown" || e.type === "touchstart"){
      return new Promise((resolve, reject) => {
        setTimeout(()=>resolve(true), 600)
      });
    }
    //same as returning false here, will cancel out the previous promise and prevent drag
    //if press was not long enough (600ms)
  };
   <DynamicContent
      ...
      confirmElementDrag={longPress}
      ...
      ></DynamicContent>
```
to start dragging after swipe (400ms continuous mousemove after mousedown):
```js 
  let isDown = false; //is pressing (whether moving or not)
  const swipe = (e, index) =>{
    if(e.type === "mousedown" || e.type === "touchstart"){
      isDown=true;
    }
    else if(isDown && (e.type === "mousemove" || e.type === "touchmove")){
      return new Promise((resolve, reject) => {
        setTimeout(()=>resolve(true), 600)
      });
    }
    //if mousedown/touchend then disable promise generated form mousemove if was
    else{
      isDown = false;
    }
  };
   <DynamicContent
      ...
      confirmElementDrag={swipe}
      ...
      ></DynamicContent>
```
to start dragging after click and then mousedown, with less than 400ms interval:
```js 
  let lastClickTime=0;
  const clickAndMousedown = (e, index) => {
    //first mosuedown/touchstart time will be remembered
    //second will trigger drag if interval less than 400ms
    if(e.type === "mousedown" || e.type === "touchstart"){
      if(new Date() - lastClickTime < 400){ return true; }
      lastClickTime = new Date();
    }
  };
   <DynamicContent
      ...
      confirmElementDrag={clickAndMousedown}
      ...
      ></DynamicContent>
```

you can use e.target to detect sub-element in case you want to drag by handle inside your elements
