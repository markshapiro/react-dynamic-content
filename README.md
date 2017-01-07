# react-dynamic-content

Component to organize custom html content using layouts and reposition by dragging.
content can be organized using cascading and google images layout, the elements that come earlier in input array are loaded & displayed first.
You can provide your own layout method.
You can move your content around by dragging with mouse/touch, repositioning changes index of element and calls "onChange" method with result.
you can provide you own drag initiation if you want the drag to start differently (for example with long click or swipe) then default (simple mousedown).
The current existing layouts (cascading, images) are forcefully resizing your content to fit into rows & columns, it is very recommended that you provide
responsive content for "cascading" layout", and content that maintains aspect between inner height & width ratio for "images" layout (you can still give border/margins).

# simple example


# input properties

elements (mandatory) - array with jsx elements of you content
layout (mandatory) - option from "cascading"/"images","custom" ("cascading" by default)

numOfColumns - num of columns to keep with "cascading" layout
columnWidth - width of columns to keep with "cascading" layout
maxHeight - 

onChange - calls with result array once element dragged to new place and its order changed
allowDraggingDesktop - True/False (default False) whether element dragging should be in desktop
allowDraggingMobile - True/False (default False) whether element dragging should be in mobile
verticalMargin - (default 0) vertical spacing between elements
horizontalMargin - (default 0) horizontal spacing between elements

confirmElementDrag - 
