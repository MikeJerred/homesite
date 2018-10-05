import { IVmBlogStub } from './vmBlogStub';

export interface IVmBlog {
    id: number;
    headline: string;
    date: Date;
    articleMarkdown: string;
    prevBlog?: IVmBlogStub;
    nextBlog?: IVmBlogStub;
}