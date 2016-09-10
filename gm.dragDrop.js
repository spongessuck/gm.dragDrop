(function() {
	'use strict';

	// Based on myDraggable - https://docs.angularjs.org/guide/directive

	angular
		.module('gm.dragDrop', [])
		.directive('gmDraggable', ['$window', '$document', gmDraggable])
		.directive('gmOnHover', gmOnHover)
		.directive('gmOnDrop', gmOnDrop);

	var dragOb = null;

	function apply(scope, attr, event) {
		scope.$apply(function() {
			scope.$eval(attr)(dragOb, event);
		});
	}

	function gmDraggable($window, $document) {
		return function(scope, element, attrs) {

			var startX = 0,
				startY = 0,
				clone = null,
				absParent = angular.element('<div></div>');

			var cancelWatch = null;
  
      var handle = null;
      angular.forEach(element.children(), function(el) {
        if(el.tagName == 'GM-DRAG-HANDLE' || el.hasAttribute("gm-drag-handle"))
          handle = angular.element(el);
      });
			(handle || element).on('mousedown', function(event) {
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
				
				absParent.css({
					position: 'absolute',
					zIndex: '2000',
					top: elBoundingRect.top + $window.scrollY + 'px',
					left:  elBoundingRect.left + 'px',
					width: elBoundingRect.width + 'px'
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

			element.on('mouseover', function(e) {
				if(!dragOb)
					return;

				if(dragOb.$$gmDropZone == attr.gmDropZone) {
					apply(scope, attr.gmOnHover, e);
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
