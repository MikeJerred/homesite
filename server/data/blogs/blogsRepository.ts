import { orderBy } from 'lodash';

import Page from '../page';
import { IDmBlog } from './dmBlogs';
import * as data1 from './data/1.json';
import * as data2 from './data/2.json';
import * as data3 from './data/3.json';
import * as data4 from './data/4.json';

const data = [data1, data2, data3, data4];
const dataById = {
    [data1.blogId]: data1,
    [data2.blogId]: data2,
    [data3.blogId]: data3,
    [data4.blogId]: data4
};

export async function getBlog(id: number): Promise<IDmBlog> {
    const index = id - 1;
    const blog = dataById[index];
    const prevBlog = dataById[index - 1];
    const nextBlog = dataById[index + 1];

    return {
        ...blog,
        prevBlog,
        nextBlog
    };
}

export async function getBlogsPage(pageNo: number, pageSize: number): Promise<Page<IDmBlog>> {
    const start = (pageNo - 1) * pageSize;
    const results = orderBy(data, 'updatedDate', 'desc').slice(start, start + pageSize);
    const count = data.length;

    return Page.build(pageNo, pageSize, results, count);
}
