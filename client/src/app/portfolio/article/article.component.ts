import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { IVmBlog } from '@homesite/shared';
import { PageLoadedService } from '~/shared/page-loaded/page-loaded.service';
import { PortfolioService } from '../portfolio.service';

@Component({
    templateUrl: './article.component.html',
    styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit, OnDestroy {
    private articleId: number;
    private subscription: Subscription;
    private isPageLoaded = false;

    public article: IVmBlog;

    constructor(
        private route: ActivatedRoute,
        private portfolioService: PortfolioService,
        pageLoadedService: PageLoadedService) {

        this.subscription = pageLoadedService.pageLoaded$().subscribe(isLoaded => {
            this.isPageLoaded = this.isPageLoaded || isLoaded;
        });
    }

    ngOnInit(): void {
        this.articleId = +this.route.snapshot.paramMap.get('id');
        this.getArticle();
    }

    ngOnDestroy(): void {
        if (this.subscription)
            this.subscription.unsubscribe();
    }

    public getArticle(): void {
        this.portfolioService.getPortfolio(this.articleId).subscribe(result => {
            this.article = result;
        });
    }
}
