React Dynamic Content
===================

## Live Demo
Live demo: [`__DEMO_LINK__`](__DEMO_LINK__)

![demo gif](__GIF_LINK__)

React dynamic content is a React component to organize custom html content using layouts and reposition by dragging.

Features of `react-dynamic-content`
* Support for any kind of content and not just images (can be text, video, complex elements)
* Organization using "cascading" or "google images" layouts that automaticaly resize elements to fit rows or columns
* Customization of layout method (you can provide you own layout positioning method)
* Elements reposition using mouse/touch drags
* Customization of drag initiation (for exampe if you want drag start with long click/swipe)
* Mobile friendly

**NOTE**: it is highly recomended that you provide responsive content (whose height changes when width changes or opposite), and if you plan using "google images" layout then please provide content that maintains aspect ratio within inner width/height (client width/height), for example plain <img>, you can still provide any margins/borders you want.

### Quick start

```bash
npm install --save react-dynamic-content
```

```jsx
import DynamicContent from 'react-dynamic-content';

class MyComponent extends React.Component {
  render() {
    const content = [
      <img src="http://lorempixel.com/1000/600 />,
      <img src="http://lorempixel.com/110/80" />,
      <div>
        text
        <br/>texttext
        <br/>text
      </div>,
      <img src="http://lorempixel.com/1000/1200" />,
      <img src="http://lorempixel.com/400/500" />,
      <iframe src={"https://www.youtube.com/embed/vO2Su3erRIA"}></iframe>
      
    ]

    return (
      <DynamicContent
        elements={content}
        layout={'cascading'}
         numOfColumns={3}
        />
    );
  }

}
``
