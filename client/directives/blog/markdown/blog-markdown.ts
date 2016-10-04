module MJ.Directives.Blog.Markdown {
    interface IScope extends ng.IScope {
        markdown: string;
    }

    declare var showdown: { Converter: Showdown.ConverterStatic };

    class BlogMarkdownDirectve implements ng.IDirective {
        public restrict = 'E';
        public scope = {
            markdown: '='
        };
        public link = (scope: IScope, element: ng.IAugmentedJQuery, attributes: ng.IAttributes) => {
            const converter = new showdown.Converter();
            scope.$watch('markdown', (markdown: string) => {
                // convert markdown to html
                element.html(converter.makeHtml(markdown));

                // add syntax highlighting to code blocks
                const codeBlocks = element[0].querySelectorAll('pre > code');
                angular.forEach(codeBlocks, block => {
                    hljs.highlightBlock(block);
                });
            });
        };
    }

    angular.module('mj.directives').directive('blogMarkdown', () => new BlogMarkdownDirectve());
}