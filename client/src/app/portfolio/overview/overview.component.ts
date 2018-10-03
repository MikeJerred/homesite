import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IVmPage, IVmPortfolioStub } from '@homesite/shared';
import { PortfolioService } from '../portfolio.service';

@Component({
    templateUrl: './overview.component.html',
    styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
    public portfolios: IVmPage<IVmPortfolioStub>;
    public pageNo = 1;
    public pageSize = 6;

    constructor(
        private route: ActivatedRoute,
        private portfolioService: PortfolioService) {
    }

    ngOnInit(): void {
        this.pageNo = +this.route.snapshot.queryParamMap.get('pageNo') || 1;
        this.getPage();
    }

    private getPage(): void {
        this.portfolioService
            .getPortfolioStubs(this.pageNo, this.pageSize)
            .subscribe(result => this.portfolios = result);
    }
}
