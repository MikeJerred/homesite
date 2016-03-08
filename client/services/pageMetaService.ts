module MJ.Services {
    export interface IPageMetaService {
        getTitle(): string;
        setTitle(title: string): void;
    }

    class PageMetaService implements IPageMetaService {
        private title = 'Michael Jerred';

        public getTitle = () => this.title;

        public setTitle(title: string): void {
            this.title = title
                ? title + ' - Michael Jerred'
                : 'Michael Jerred';
        }
    }

    angular.module('mj.services').service('pageMeta', PageMetaService);
}