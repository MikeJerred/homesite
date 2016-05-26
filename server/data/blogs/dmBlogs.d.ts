declare module MJ.Server.Data.Blogs {
    export interface IDmBlog {
        id: number;
        headline: string;
        date: Date;
        markdown: string;
    }
}