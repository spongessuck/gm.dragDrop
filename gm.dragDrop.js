(function() {
	'use strict';

	// Based on myDraggable - https://docs.angularjs.org/guide/directive

	angular
		.module('gm.dragDrop')
		.directive('gmDraggable', ['$document', gmDraggable])
		.directive('gmOnDrop', gmOnDrop);

	var dragOb = null;

	function gmDraggable($document) {
		return function(scope, element, attr) {

			var startX = 0,
				startY = 0,
				clone = null,
				absParent = angular.element('<div></div>');

			element.css({
				cursor: 'pointer'
			});

			element.on('mousedown', function(event) {
				// Prevent default dragging of selected content
				event.preventDefault();

				dragOb = scope.$eval(attr.gmDraggable);
				dragOb.$$gmDragZone = attr.gmDragZone;

				clone = element.clone();
				clone.css({
					visibility: 'hidden'
				});
				element.after(clone);

				element.css({
					position: 'relative',
					backgroundColor: 'lightgrey',
					pointerEvents: 'none'
				});

				var elBoundingRect = element[0].getBoundingClientRect();
				absParent.css({
					position: 'absolute',
					zIndex: '2000',
					top: elBoundingRect.top + 'px',
					left:  elBoundingRect.left + 'px'
				});
				$document.find('body').append(absParent);
				absParent.append(element);

				startX = event.pageX;
				startY = event.pageY;
				$document.on('mousemove', mousemove);
				$document.on('mouseup', mouseup);
			});

			function mousemove(event) {
				element.css({
					top: event.pageY - startY + 'px',
					left:  event.pageX - startX + 'px'
				});
			}

			function mouseup() {
				clone.after(element);
				clone.remove();
				element.css({
					position: '',
					backgroundColor: '',
					top: '',
					left: '',
					pointerEvents: '',
					zIndex: ''
				});
				absParent.remove();
				dragOb = null;
				$document.off('mousemove', mousemove);
				$document.off('mouseup', mouseup);
			}
		};
	}

	function gmOnDrop() {
		return function(scope, element, attr) {

			element.on('mouseover', function() {
				if(!dragOb)
					return;

				if(dragOb.$$gmDragZone == attr.gmDragZone) {
					element.css({
						backgroundColor: 'lightgrey'
					});
				}
			});

			element.on('mouseout', function() {
				if(!dragOb)
					return;

				element.css({
					backgroundColor: ''
				});
			});

			element.on('mouseup', function() {
				if(!dragOb)
					return;

				if(dragOb.$$gmDragZone == attr.gmDragZone) {
					scope.$eval(attr.gmOnDrop)(dragOb);
				}

				element.css({
					backgroundColor: ''
				});
			});
		}
	}
})();
