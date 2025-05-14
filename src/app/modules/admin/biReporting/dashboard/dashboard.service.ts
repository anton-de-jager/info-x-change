import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DashboardService {
    private _data: BehaviorSubject<any> = new BehaviorSubject(null);
    private _dataInfoX: BehaviorSubject<any> = new BehaviorSubject(null);
    private _dataExecutiveSummary: BehaviorSubject<any> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for data
     */
    get data$(): Observable<any> {
        return this._data.asObservable();
    }
    get dataInfoX$(): Observable<any> {
        return this._dataInfoX.asObservable();
    }
    get dataExecutiveSummary$(): Observable<any> {
        return this._dataExecutiveSummary.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get data
     */
    getData(): Observable<any> {
        return this._httpClient.get('api/dashboards/dashboard').pipe(
            tap((response: any) => {
                this._data.next(response);
            })
        );
    }
    getDataInfoX(): Observable<any> {
        return this._httpClient.get('api/dashboards/infox').pipe(
            tap((response: any) => {
                this._dataInfoX.next(response);
            })
        );
    }
    getDataExecutiveOverview(): Observable<any> {
        return this._httpClient.get('api/dashboards/executive-overview').pipe(
            tap((response: any) => {
                this._dataExecutiveSummary.next(response);
            })
        );
    }
}
