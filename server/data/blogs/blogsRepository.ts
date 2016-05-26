import Page from './data/page';
import Blogs = MJ.Server.Data.Blogs;

export async function getBlog(id: number): Promise<Blogs.IDmBlog> {
    // todo: actually query the database

    return {
        id: id,
        headline: 'Test Headline',
        markdown: 'Test article copy',
        date: new Date()
    };
}

export async function getBlogs(pageNo: number, pageSize: number): Promise<Page<Blogs.IDmBlog>> {
    // todo: actually query the database

    let skip = pageSize * (pageNo - 1);

    let ids = (function*(start: number, count: number) {
        for (let i = start; i < start + count; i++)
            yield i;
    })(skip+1, pageSize);

    let items = Array.from(ids, id => this.getBlog(id));
    let count = 100;

    return Page.Build(pageNo, pageSize, items, count);
}
