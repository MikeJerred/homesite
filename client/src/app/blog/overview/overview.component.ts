import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IVmPage, IVmBlogStub } from '@homesite/shared';
import { BlogService } from '../blog.service';

@Component({
    templateUrl: './overview.component.html',
    styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
    public blogs: IVmPage<IVmBlogStub>;
    public pageNo = 1;
    public pageSize = 6;

    constructor(
        private route: ActivatedRoute,
        private blogService: BlogService) {
    }

    ngOnInit(): void {
        this.pageNo = +this.route.snapshot.queryParamMap.get('pageNo') || 1;
        this.getPage();
    }

    private getPage(): void {
        this.blogService
            .getBlogStubs(this.pageNo, this.pageSize)
            .subscribe(result => this.blogs = result);
    }
}
