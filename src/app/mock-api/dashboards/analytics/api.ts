import { Injectable } from '@angular/core';
import { FuseMockApiService } from '@fuse/lib/mock-api';
import { analytics as analyticsData } from 'app/mock-api/dashboards/analytics/data';
import { infoX } from 'app/mock-api/dashboards/analytics/data';
import { executiveOverview } from 'app/mock-api/dashboards/analytics/data';
import { portfolioOverview } from 'app/mock-api/dashboards/analytics/data';
import { cloneDeep } from 'lodash-es';

@Injectable({ providedIn: 'root' })
export class AnalyticsMockApi {
    private _analytics: any = analyticsData;
    private _infoX: any = infoX;
    private _executiveOverview: any = executiveOverview;
    private _portfolioOverview: any = portfolioOverview;

    /**
     * Constructor
     */
    constructor(private _fuseMockApiService: FuseMockApiService) {
        // Register Mock API handlers
        this.registerHandlers();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Register Mock API handlers
     */
    registerHandlers(): void {
        // -----------------------------------------------------------------------------------------------------
        // @ Sales - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/dashboards/dashboard')
            .reply(() => [200, cloneDeep(this._analytics)]);

        this._fuseMockApiService
            .onGet('api/dashboards/infox')
            .reply(() => [200, cloneDeep(this._infoX)]);

        this._fuseMockApiService
            .onGet('api/dashboards/executive-overview')
            .reply(() => [200, cloneDeep(this._executiveOverview)]);

        this._fuseMockApiService
            .onGet('api/dashboards/portfolio-overview')
            .reply(() => [200, cloneDeep(this._portfolioOverview)]);
    }
}
