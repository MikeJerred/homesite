import Page from '../page';
import Blogs = MJ.Server.Data.Blogs;

export async function getBlog(id: number): Promise<Blogs.IDmBlog> {
    // todo: actually query the database

    const md = `# Injecting stylesheets with angularJS

I had a play around with using angular to modify what stylesheets are loaded by the browser. The goal was to only have stylesheets loaded that were relevant for the current page (technically the current \`route\` in a single page app), and the motivation behind this was that in a single page app you normally would have to load all the stylesheets for the whole site. This is a problem because it means you have to be careful with your css selectors to make sure that a rule won't accidentally be applied to some other part of the site it wasn't intended for.

A quick example to outline this problem: suppose we are building a homesite for a company, and on one of the pages they list available job positions. We might have a css rule that look like this:

\`\`\`
ul.jobs > li.job { background-color: #fff; }
\`\`\`

Now on a totally different part of the site, perhaps in the administrative section, there might be a page where you can queue up jobs that need to be done (a completely different meaning for the same word \`job\`), you might write a css rule like:

\`\`\`
ul.jobs > li.job { width: 50%; }
\`\`\`

Now these rules will be applied on both pages which was not the intention. The larger the website gets, the more likely it is that we will run into this sort of problem.

It turns out that it is quite easy to get angular to manipulate the loaded stylesheets. We create a directive like this:

*Note: I've used the ES6 [arrow function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) notation, and often in examples I will use [typescript](http://www.typescriptlang.org/) instead of plain javascript code.*


\`\`\`javascript
angular.module('app').directive('injectStyles', () => ({
    replace: true,
    restrict: 'E',
    scope: {},
    template: '<link ng-repeat="url in stylesheets" ng-href="{{url}}" rel="stylesheet" />',
    link: (scope) => {
        scope.stylesheets = [];
    }
}));
\`\`\`

Then we put it in the \`head\` section:

\`\`\`html
<head>
    <!-- other stuff -->

    <inject-styles></inject-styles>
</head>
\`\`\`

Now we just need to keep the \`stylesheets\` variable up-to-date with what we want loaded. If we are using [\`angular-ui-router\`](https://github.com/angular-ui/ui-router) to do the routing, then we can hook onto the \`$stateChangeSuccess\` event in our directive:

*Note: If the \`_\` seems mysterious it's because I'm using [lodash](https://lodash.com/). I apologize for using things that aren't plain javascript. I will try to minimize the amount of non-standard knowledge required; albeit taking some liberties if it makes the code considerably easier to read, or if I think it's essential knowledge for modern web development.*

\`\`\`javascript
angular.module('app').directive('injectStyles', [
    '$rootScope',
    ($rootScope) => ({
        replace: true,
        restrict: 'E',
        scope: {},
        template: '<link ng-repeat="url in stylesheets" ng-href="{{url}}" rel="stylesheet" />',
        link: (scope) => {
            scope.stylesheets = [];

            $rootScope.$on('$stateChangeStart', (event, toState) => {
                scope.stylesheets =  _(toState.views)
                    .pluck<string>('stylesheetUrl')
                    .filter(value => value !== undefined)
                    .value();
            });
        }
})]);
\`\`\`

We need to add a \`stylesheetUrl\` property to each of the states views:

\`\`\`
angular.module('app').config(['$stateProvider', ($stateProvider) => {
    var mainView = {
        templateUrl: 'views/home/home.html',
        stylesheetUrl: 'views/home/home.css',
        controller: ...
    };
    var headerView = ...
    var footerView = ...

    $stateProvider.state('home', {
        url: '/home',
        views: {
            'main': mainView,
            'header': headerView,
            'footer': footerView
        }
    });
}]);
\`\`\`

Now whenever the user changes state, we will replace the stylesheets in the \`head\` element with the ones for the new state!

This gives the general idea, but we actually need to make it a bit more robust. If we have a nested state e.g. \`home.\`



For this to work you must have the ng-app directive on the \`html\` element


\`\`\`
interface IScope extends ng.IScope {
    stylesheets: string[];
}

function getStylesheets(state: ng.ui.IState): string[] {
    var stylesheets = _(state.views).pluck<string>('stylesheet').filter(value => value !== undefined).value();
    if (state.parent) {
        return _.union(stylesheets, getStylesheets(state.parent));
    }

    return stylesheets;
}

function getRelatedStylesheets(allStates: ng.ui.IState[], name: string): _.LoDashImplicitArrayWrapper<string> {
    var nameFragments = name.split('.');

    var ancestorNames = _(nameFragments)
        .map((item, index, collection) => _.reduce(_.take(collection, index + 1), (acc, s) => acc + '.' + s))
        .value();

    return _(allStates)
        .filter(state => _.any(ancestorNames, item => item === state.name))
        .map(state => getStylesheets(state))
        .flatten();
}

angular.module('app').directive('injectStyles',
    ['$rootScope', '$compile', '$state',
    ($rootScope: ng.IRootScopeService, $compile: ng.ICompileService, $state: ng.ui.IStateService) => ({
        restrict: 'E',
        scope: {},
        template: '<link ng-repeat="url in stylesheets" ng-href="{{url}}" rel="stylesheet" />',
        link: (scope: IScope, element: ng.IAugmentedJQuery) => {
            scope.stylesheets = [];

            // whenever we change state, load the stylesheets for the state we are going to
            $rootScope.$on('$stateChangeStart', (event: any, toState: ng.ui.IState) => {
                scope.stylesheets = getRelatedStylesheets($state.get(), toState.name)
                    .union(scope.stylesheets)
                    .value();
            });

            // removes any stylesheets that are no longer needed (we want to keep all stylesheets there during transitions)
            $rootScope.$on('$stateChangeSuccess', (event: any, toState: ng.ui.IState) => {
                scope.stylesheets = getRelatedStylesheets($state.get(), toState.name).value();
            });
        }
    })]);
\`\`\``;

    return {
        id: id,
        headline: 'Test Headline',
        markdown: md,
        date: new Date()
    };
}

export async function getBlogs(pageNo: number, pageSize: number): Promise<Page<Blogs.IDmBlog>> {
    // todo: actually query the database

    let skip = pageSize * (pageNo - 1);
    let count = 100;

    let results: Blogs.IDmBlog[] = [];
    for (let i = skip; i < skip + pageSize; i++) {
        let blog = await getBlog(i);
        results.push(blog);
    }

    return Page.build(pageNo, pageSize, results, count);
}
