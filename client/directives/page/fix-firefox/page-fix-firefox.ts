module MJ.Directives.Page.PageFixedToParent {
    declare var InstallTrigger: any;

    interface IScope extends ng.IScope {
        imageRefresh?: any,
        styles?: { [key: string]: string }
    }

    // Hack for firefox, which has a bug that resizes images with background-attachment: fixed causing a 'jump' when the page loads.
    // Creates an element that has position fixed but takes on the size and background of its parent
    angular.module('mj.directives').directive('pageFixFirefox', [
        '$window', '$timeout',
        ($window: ng.IWindowService, $timeout: ng.ITimeoutService) => ({
            restrict: 'A',
            scope: {
                imageRefresh: '=', // refresh the background-image from the parent whenever this changes
                styles: '=pageFixFirefox'
            },
            link: (scope: IScope, element: ng.IAugmentedJQuery, attributes: ng.IAttributes) => {
                let isFirefox = typeof InstallTrigger !== 'undefined';
                if (isFirefox) {
                    let image = element.css('background-image');
                    let size = element.css('background-size');
                    let position = element.css('background-position');
                    element.css({ 'background-image': 'none' });

                    let bg = $('<div></div>').prependTo(element);
                    bg.css({
                        position: 'fixed',
                        'z-index': -1,
                        'background-image': image,
                        'background-size': size,
                        'background-position': position
                    });
                    bg.css(scope.styles || { top: 0, left: 0 });

                    scope.$watch(() => scope.imageRefresh, () => {
                        // save the style
                        let inlineStyle = element.css('background-image');
                        // remove the inline style and store the value
                        let value = element.css('background-image', '').css('background-image');
                        // put the inline style back
                        if (inlineStyle !== value)
                            element.css('background-image', inlineStyle);

                        bg.css('background-image', value);
                    });

                    // hack: timeout here to prevent angular reaching 10 digest cycles in release mode.
                    // this seems to be to do with the critical html causing the height & width to change rapidly.
                    $timeout(() => {
                        scope.$watchGroup(
                            [
                                () => element.outerHeight(),
                                () => element.outerWidth()
                            ],
                            (values: number[]) => {
                                bg.height(values[0]);
                                bg.width(values[1]);
                            });
                    }, 300);

                    scope.$watch(
                        () => element[0].getBoundingClientRect().top < ($window.innerHeight + 100)
                            && element[0].getBoundingClientRect().bottom > -100,
                        (visible) => {
                            if (visible) {
                                bg.css('display', '');
                            } else {
                                bg.css('display', 'none');
                            }
                        }
                    );
                }
            },
            template: ''
        })
    ]);
}