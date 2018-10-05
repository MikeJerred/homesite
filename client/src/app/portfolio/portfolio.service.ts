import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { IVmPage, IVmPortfolio, IVmPortfolioStub } from '@homesite/shared';

@Injectable()
export class PortfolioService {
    constructor(private http: HttpClient) {
    }

    public getPortfolioStubs(pageNo: number, pageSize: number): Observable<IVmPage<IVmPortfolioStub>> {
        return this.http.get<IVmPage<IVmPortfolioStub>>(`api/portfolio-stubs?pageNo=${pageNo}&pageSize=${pageSize}`);
    }

    public getPortfolio(id: number): Observable<IVmPortfolio> {
        return this.http.get<IVmPortfolio>(`api/portfolios/${id}`);
    }
}