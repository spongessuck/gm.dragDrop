(function() {
	'use strict';

	// Based on myDraggable - https://docs.angularjs.org/guide/directive

	angular
		.module('gm.dragDrop', [])
		.directive('gmDraggable', ['$document', gmDraggable])
		.directive('gmOnHover', gmOnHover)
		.directive('gmOnDrop', gmOnDrop);

	var dragOb = null;

	function apply(scope, attr) {
		scope.$apply(function() {
			scope.$eval(attr)(dragOb);
		});
	}

	function gmDraggable($document) {
		return function(scope, element, attrs) {

			var startX = 0,
				startY = 0,
				clone = null,
				absParent = angular.element('<div></div>');

			element.css({
				cursor: 'pointer'
			});

			var cancelWatch = null;

			element.on('mousedown', function(event) {
				// Prevent default dragging of selected content
				event.preventDefault();

				cancelWatch = scope.$watch(function() {
					return element.prop('innerHTML');
				}, function(val) {
					if(clone)
						clone.prop('innerHTML', val);
				});

				dragOb = scope.$eval(attrs.gmDraggable);
				dragOb.$$gmDropZone = attrs.gmDropZone;

				clone = element.clone();
				element.addClass('gm-drag-element').after(clone);

				clone.css({
					position: 'relative',
					pointerEvents: 'none'
				}).addClass('gm-dragging');

				var elBoundingRect = element[0].getBoundingClientRect();
				console.log(elBoundingRect.left, elBoundingRect.top, event.pageX, event.pageY);
				absParent.css({
					position: 'absolute',
					zIndex: '2000',
					top: elBoundingRect.top + 'px',
					left:  elBoundingRect.left + 'px'
				});
				$document.find('body').append(absParent);
				absParent.append(clone);

				startX = event.pageX;
				startY = event.pageY;
				$document.on('mousemove', mousemove);
				$document.on('mouseup', mouseup);
			});

			function mousemove(event) {
				clone.css({
					top: event.pageY - startY + 'px',
					left:  event.pageX - startX + 'px'
				});
			}

			function mouseup() {
				if(dragOb) {
					if(attrs.gmOnInvalidDrop) {
						apply(scope, attrs.gmOnInvalidDrop);
					}
					dragOb = null;
				}

				cancelWatch();

				element.removeClass('gm-drag-element');

				clone.remove();
				absParent.remove();
				$document.off('mousemove', mousemove);
				$document.off('mouseup', mouseup);
			}
		};
	}

	function gmOnHover() {
		return function(scope, element, attr) {
			element.on('mouseover', function() {
				if(!dragOb)
					return;

				if(dragOb.$$gmDropZone == attr.gmDropZone) {
					apply(scope, attr.gmOnHover);
				}
			});
		}
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
					apply(scope, attr.gmOnDrop);
					dragOb = null;
				}

				element.removeClass('gm-dropping');
			});
		}
	}
})();
