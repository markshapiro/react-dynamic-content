React Image Gallery
===================

## Live Demo
Live demo: [`__DEMO_LINK__`](__DEMO_LINK__)

![demo gif](__GIF_LINK__)

React image gallery is a React component to organize custom html content using layouts and reposition by dragging.

Features of `react-image-gallery`
* Organization of custom content using "cascading", "google images" or your custom layout
* Element reposition using mouse/touch drags
* Customization of drag initiation (for exampe if you want drag start with long click/swipe)
* Mobile friendly

### Quick start

```bash
npm install --save react-dynamic-content
```

```jsx
import DynamicContent from 'react-image-gallery';

class MyComponent extends React.Component {
  render() {
    const content = [
      <img src="http://lorempixel.com/1000/600 />,
      <img src="http://lorempixel.com/1000/600" />,
      <div>
        text
        <br/>texttext
        <br/>text
      </div>,
      <img src="http://lorempixel.com/1000/1200" />,
      <img src="http://lorempixel.com/400/500" />,
      
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
