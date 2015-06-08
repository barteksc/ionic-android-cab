(function () {
    angular.module('barteksch.cab', [])
        .filter('limit', limitFilter)
        .factory('$androidCab', $androidCab);

    $androidCab.$inject = ['$document', '$compile', '$rootScope', '$ionicSideMenuDelegate', '$ionicPopover']

    function $androidCab($document, $compile, $rootScope, $ionicSideMenuDelegate, $ionicPopover) {
        var defaults = {
            actions: [],
            color: '#757575',
            fontColor: '#FFFFFF',
            counterSize: 18,
            height: 44,
            zIndex: 9,
            actionsOnBar: 2,
            showCounter: true,
            selectedProp: 'selected',
            useAnimation: true,
            onShow: function () {
            },
            onHide: function () {
            },
            onDestroy: function () {
            },
            onFirstShow: function () {
            }
        };
        var $body = angular.element($document[0].body);
        var barTemplate = '<div ng-style="barCss">' +
            '<button ng-style="::fontColorCss" class="button button-clear icon ion-android-arrow-back context-menu-back" ng-click="hide()"></button>' +
            '<div ng-style="::actionsCss" >' +
            '<button ng-style="::fontColorCss" ng-repeat="action in actions|limit:actionsOnBar" class="button button-clear icon {{action.icon}}" ng-click="actionClick($event, $index)" ng-if="actionVisible(action)" ng-cloak></button>' +
            '<button ng-style="::fontColorCss" class="button button-clear icon ion-android-more-vertical" ng-click="toggleMore($event)" ng-if="actions.length > actionsOnBar"></button>' +
            '</div>' +
            '<div ng-style="::counterCss" ng-style="::fontColorCss" ng-if="showCounter">{{selectedItems.length}}</div>' +
            '</div>';
        var moreTemplate = '<ion-popover-view ng-style="::popoverCss"><ion-content>' +
            '<div class="list">' +
            '<a href ng-repeat="action in actions|limit:100:actionsOnBar" ng-if="actionVisible(action)" class="item" ng-click="actionClick($event, $index, true)">{{action.title}}</a>' +
            '</div>' +
            '</ion-content></ion-popover-view>';

        function ContextMenu(options) {
            var that = this;
            var dragContentState;
            var firstShow = false;
            var barCss = {
                display: 'none',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: options.height + 'px',
                backgroundColor: options.color,
                zIndex: options.zIndex,
                color: options.fontColor
            };
            var counterCss = {
                display: 'inline-block',
                lineHeight: options.height + 'px',
                color: options.fontColor,
                fontSize: options.counterSize + 'px',
                marginLeft: '5px'
            };
            var actionsCss = {
                color: options.fontColor,
                float: 'right'
            };
            var popoverCss = {
                height: 53 * (options.actions.length - options.actionsOnBar) + 'px' //53px is popover item height
            };
            var scope = $rootScope.$new(true);
            angular.extend(scope, {
                actions: options.actions,
                hide: hide,
                counterCss: counterCss,
                barCss: barCss,
                actionsCss: actionsCss,
                fontColorCss: {color: options.fontColor},
                popoverCss: popoverCss,
                selectedItems: [],
                actionClick: actionClick,
                toggleMore: toggleMore,
                actionsOnBar: options.actionsOnBar,
                showCounter: options.showCounter,
                actionVisible: actionVisible
            });
            var $el = $compile(barTemplate)(scope);
            $body.append($el);

            var popover = $ionicPopover.fromTemplate(moreTemplate, {
                scope: scope
            });

            this.toggleItem = function (item) {
                if (options.selectedProp in item) {
                    this.removeItem(item)
                    delete item[options.selectedProp];
                } else {
                    item[options.selectedProp] = true;
                    scope.selectedItems.push(item);
                    if (scope.selectedItems.length === 1) {
                        this.show();
                    }
                }
            };

            this.removeItem = function (condition) {
                scope.selectedItems = _.reject(scope.selectedItems, condition);
                if (scope.selectedItems.length === 0) {
                    this.hide();
                }
            };

            this.hasItem = function (condition) {
                return !!_.findWhere(scope.selectedItems, condition);
            };

            this.pushAction = function (action) {
                scope.actions.push(action);
            };

            this.popAction = function () {
                return scope.actions.pop();
            };

            this.destroy = function () {
                hide();
                options.onDestroy();
                scope.$destroy();
                $body = undefined;
                popover.remove();
                $el.remove();
            };

            function show() {
                if(this.isShown()) {
                    return;
                }
                dragContentState = $ionicSideMenuDelegate.canDragContent();
                if (!firstShow) {
                    firstShow = true;
                    options.onFirstShow();
                } else {
                    options.onShow();
                }
                barCss.display = 'block';
                if (dragContentState) {
                    $ionicSideMenuDelegate.canDragContent(false);
                }
            };
            this.show = show;

            function hide() {
                options.onHide(scope.selectedItems);
                angular.forEach(scope.selectedItems, function (item) {
                    delete item[options.selectedProp];
                });
                scope.selectedItems = [];
                barCss.display = 'none';
                if (dragContentState) {
                    $ionicSideMenuDelegate.canDragContent(true);
                }
            };
            this.hide = hide;

            this.isShown = function isShown() {
                return barCss.display === 'block';
            }

            function actionClick($event, $index, isMoreAction) {
                if (isMoreAction) {
                    popover.hide();
                }
                scope.actions[isMoreAction ? $index + options.actionsOnBar : $index].click($event, scope.selectedItems);
                hide();
            }

            function toggleMore($event) {
                if (popover.isShown()) {
                    popover.hide();
                } else {
                    popover.show($event);
                }
            }

            function actionVisible(action) {
                if (action.show) {
                    return action.show(scope.selectedItems);
                }
                return true;
            }
        }

        return {
            prepare: function (options) {
                var ops = angular.extend({}, defaults, options);
                return new ContextMenu(ops);
            },
            setDefaults: function (options) {
                angular.extend(defaults, options);
            }
        };
    }

    //modified limitTo filter from angular 1.4
    function limitFilter() {
        return function (input, limit, begin) {
            if (Math.abs(Number(limit)) === Infinity) {
                limit = Number(limit);
            } else {
                limit = parseInt(limit);
            }
            if (isNaN(limit)) return input;

            if (angular.isNumber(input)) input = input.toString();
            if (!angular.isArray(input) && !angular.isString(input)) return input;

            begin = (!begin || isNaN(begin)) ? 0 : parseInt(begin);
            begin = (begin < 0 && begin >= -input.length) ? input.length + begin : begin;

            if (limit >= 0) {
                return input.slice(begin, begin + limit);
            } else {
                if (begin === 0) {
                    return input.slice(limit, input.length);
                } else {
                    return input.slice(Math.max(0, begin + limit), begin);
                }
            }
        };
    }
}());