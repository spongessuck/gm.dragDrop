# gm.dragDrop
Angular directives to add native, simple, data-driven drag and drop functionality.

## Include
gm.dragDrop is available on both NPM and Bower:

    $ npm/bower install gm.drag-drop --save

## Usage
First, add the `gm.dragDrop` module to your app's dependencies:

    var app = angular.module('myApp', ['gm.dragDrop']);

There are 2 directives included in the module: `gmDraggable` and `gmOnDrop`. Adding the `gmDraggable` attribute to an element makes it draggable. Adding the `gmOnDrop` attribute to an element sets it as a drop zone for the draggable element. Set the value of `gmOnDrop` to a function that will be called when the dragged element is released. Set the value of `gmDraggable` to the object you want to be passed to `gmOnDrop`.

#### Sample controller:
```javascript
...
this.data = { key: "number", value: "1" }

this.onDrop = function(_data) {
    console.log(_data.key, _data.value); // number 1
}
...
```

#### Sample template:
```html
<span gm-draggable="$ctrl.data">Number {{data.value}}</span>
<div style='width:30%; float:right; padding:50px; border:solid black 1px' gm-on-drop="$ctrl.onDrop">Drop Area</div>
```

#### Style
You can define style for two classes, `.gm-dragging` and `.gm-dropping`, to set the style of the element being dragged and the drop zone element when the mouse hovers over it while dragging, respectively.

## IMPORTANT
By default, the element being draggged will return to its original position when released, which can give unexpected results if you're changing your view models in `gmOnDrop`. If you are altering the structure of your data in the `gmOnDrop` function, return a truthy value from that function to prevent this behavior.

## Drop Zones
You can also define a `gm-drop-zone` attribute on both draggable elements and drop zones to control where elements can be dropped. Draggable elements can only be dropped on drop zones when their `gm-drop-zone` attribute matches.

#### Sample template using drop zones:
```html
<span gm-draggable="$ctrl.data" gm-drop-zone='1'>Number {{data.value}}</span>
<div style='width:30%; float:right; padding:50px; border:solid black 1px' gm-on-drop="$ctrl.onDrop" gm-drop-zone='2'>Cannot Drop Here</div>
<div style='width:30%; float:right; padding:50px; border:solid black 1px' gm-on-drop="$ctrl.onDrop" gm-drop-zone='1'>Drops Allowed Here</div>
```

## Demo
http://plnkr.co/edit/Gz4FuH?p=preview
