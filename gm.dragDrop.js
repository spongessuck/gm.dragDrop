(function() {
	'use strict';

	// Based on myDraggable - https://docs.angularjs.org/guide/directive

	angular
		.module('gm.dragDrop', [])
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
				dragOb.$$gmDropZone = attr.gmDropZone;

				clone = element.clone();
				clone.css({
					visibility: 'hidden',
				});
				element.after(clone);

				element.css({
					position: 'relative',
					pointerEvents: 'none'
				});
				element.addClass('gm-dragging');

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
		    if(dragOb) {
				  dragOb = null;
				  clone.replaceWith(element);
				} else {
				  clone.remove();
				}
				
				element.css({
					position: '',
					top: '',
					left: '',
					pointerEvents: ''
				});
				element.removeClass('gm-dragging');
				absParent.remove();
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
        
				if(dragOb.$$gmDropZone == attr.gmDropZone) {
					element.addClass('gm-dropping');
				}
			});

			element.on('mouseout', function() {
				if(!dragOb)
					return;

				element.removeClass('gm-dropping');
			});

			element.on('mouseup', function() {
				if(!dragOb)
					return;

				if(dragOb.$$gmDropZone == attr.gmDropZone) {
					scope.$apply(function() {
					  if(scope.$eval(attr.gmOnDrop)(dragOb)) {
					    dragOb = null;
					  }
					});
				}

				element.removeClass('gm-dropping');
			});
		}
	}
})();
