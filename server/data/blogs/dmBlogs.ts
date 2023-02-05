export interface IDmBlog {
    blogId: number;
    prevBlog?: IDmBlog;
    nextBlog?: IDmBlog;
    headline: string;
    updatedDate: number;
    markdown: string;
}
