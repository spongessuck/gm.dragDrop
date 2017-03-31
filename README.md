# gm.dragDrop
AngularJS directives to add native, simple, data-driven drag and drop functionality.

## Include
gm.dragDrop is available on both NPM and Bower:

    $ npm/bower install gm.drag-drop --save

## Use
First, add the `gm.dragDrop` module to your app's dependencies:

```javascript
var app = angular.module('myApp', ['gm.dragDrop']);
```

There are 3 directives included in the module: `gmDraggable`, `gmOnDrop`, and `gmOnHover`. Adding the `gmDraggable` directive to an element makes it draggable. Adding the `gmOnDrop` directive to an element sets it as a drop zone for the draggable element. Set the value of `gmOnHover` or `gmOnDrop` to a function that will be called when the dragged element is over or released on an element, respectively. Set the value of `gmDraggable` to the object you want to be passed to `gmOnDrop`.

Items with `gmDraggable` set can also assign a function to a `gmOnInvalidDrop` attribute, which will be called if the item is dropped anywhere but a valid drop zone.

#### Sample controller:
```javascript
...

this.data = { key: "number", value: "1" }

this.onHover = function(_data, mouseEvent) {
    console.log('hovering', _data.key, _data.value); // hovering number 1
}

this.onDrop = function(_data) {
    console.log('dropped', _data.key, _data.value); // dropped number 1
}

this.invalidDrop = function(_data) {
    console.log('invalid drop', _data.key, _data.value); // invalid drop number 1
}

...
```

#### Sample template:
```html
<span gm-draggable="$ctrl.data" gm-on-invalid-drop='$ctrl.invalidDrop'>Number {{data.value}}</span>
<div style='width:30%; float:right; padding:50px; border:solid black 1px' gm-on-drop="$ctrl.onDrop" gm-on-hover='$ctrl.onHover'>Drop Area</div>
```

#### Style
You can define style for three classes, `.gm-drag-element`, `.gm-dragging` and `.gm-dropping`, to set the style of the original element that was clicked, the element being dragged, and the drop zone element when the mouse hovers over it while dragging, respectively.

## Drop Zones
You can also define a `gm-drop-zone` attribute on both draggable elements and drop zones to control where elements can be dropped. Functions assigned to an element's `gm-on-drop` or `gm-on-hover` attributes will only be called when its `gm-drop-zone` attribute matches the dragged element's `gm-drop-zone` attribute.

#### Sample template using drop zones:
```html
<span gm-draggable="$ctrl.data" gm-drop-zone='1'>Number {{$ctrl.data.value}}</span>
<div style='width:30%; float:right; padding:50px; border:solid black 1px' gm-on-drop="$ctrl.onDrop" gm-drop-zone='2'>Cannot Drop Here</div>
<div style='width:30%; float:right; padding:50px; border:solid black 1px' gm-on-drop="$ctrl.onDrop" gm-drop-zone='1'>Drops Allowed Here</div>
```

## Handles
You can add a child element to a `gm-draggable` element with the tag name, attribute, or class `gm-drag-handle` to have it act as the drag 'handle' if you don't want the entire element to respond to dragging.

### Sample template using a drag handle:
```html
<span gm-draggable="$ctrl.data">
	<span class="gm-drag-handle">[Dragging only works if you click here]</span> Number {{$ctrl.data.value}}
</span>
```

## Demo
http://plnkr.co/edit/Gz4FuH?p=preview
