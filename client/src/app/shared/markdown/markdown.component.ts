import { Component, Input } from '@angular/core';
import * as marked from 'marked';
import * as hljs from 'highlight.js';

@Component({
    template: `<div [innerHTML]="getHtml()"></div>`,
    selector: 'app-markdown',
    styleUrls: ['./markdown.component.scss']
})
export class MarkdownComponent {
    @Input() public markdown: string;

    public getHtml(): string {
        if (this.markdown) {
            return marked(
                this.markdown,
                {
                    highlight: (code, language) => language
                        ? hljs.highlight(language, code).value
                        : hljs.highlightAuto(code).value
                });
        }

        return null;
    }
}
