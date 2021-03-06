(function (ng) {
    'use strict';
    var module = ng.module('lrInfiniteScroll', []);

    module.directive('lrInfiniteScroll', [
        '$timeout', '$document', '$window',
        function (timeout, $document, $window) {
            return {
                link: function (scope, element, attr) {
                    var
                        lengthThreshold = attr.scrollThreshold || 50,
                        timeThreshold = attr.timeThreshold || 400,
                        handler = scope.$eval(attr.lrInfiniteScroll),
                        promise = null,
                        lastRemaining = 9999;

                    lengthThreshold = parseInt(lengthThreshold, 10);
                    timeThreshold = parseInt(timeThreshold, 10);

                    if (!handler || !ng.isFunction(handler)) {
                        handler = ng.noop;
                    }

                    $document.bind('scroll', function () {
                        var bottom = element[0].offsetTop + element[0].offsetHeight,
                            scrollBottom = $window.scrollY + $document[0].documentElement.offsetHeight,
                            remaining = bottom - scrollBottom;

                        //if we have reached the threshold and we scroll down
                        if (remaining < lengthThreshold && (remaining - lastRemaining) < 0) {

                            //if there is already a timer running which has not
                            // expired yet we have to cancel it and restart the
                            // timer
                            if (promise !== null) {
                                timeout.cancel(promise);
                            }
                            promise = timeout(function () {
                                handler();
                                promise = null;
                            }, timeThreshold);
                        }
                        lastRemaining = remaining;
                    });
                }

            };
        }
    ]);
})(angular);
