import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { IVmPage, IVmBlog, IVmBlogStub } from '@homesite/shared';

@Injectable()
export class BlogService {
    constructor(private http: HttpClient) {
    }

    public getBlogStubs(pageNo: number, pageSize: number): Observable<IVmPage<IVmBlogStub>> {
        return this.http.get<IVmPage<IVmBlogStub>>(`api/blog-stubs?pageNo=${pageNo}&pageSize=${pageSize}`);
    }

    public getBlog(id: number): Observable<IVmBlog> {
        return this.http.get<IVmBlog>(`api/blogs/${id}`);
    }
}