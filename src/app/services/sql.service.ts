import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { UserService } from "app/core/user/user.service";
import { environment } from "environments/environment";
import { Observable, of } from "rxjs";
import { Guid } from 'guid-typescript';

@Injectable({
    providedIn: 'root',
})
export class SqlService {

    constructor(
        private userService: UserService,
        private http: HttpClient
    ) { }

    getConfigTable(id: Guid): Observable<any> {
        try {
            return this.http.post(environment.api + 'Config/table/' + id.toString(), null);
        } catch (error) {
            console.error(error);
            const result = { data: [] };
            const observableResult: Observable<any> = of(result);
            return observableResult;
        }
    }

    getConfigColumns(id: Guid): Observable<any> {
        try {
            return this.http.post(environment.api + 'Config/columns/' + id.toString(), null);
        } catch (error) {
            console.error(error);
            const result = { data: [] };
            const observableResult: Observable<any> = of(result);
            return observableResult;
        }
    }

    getData(table: string, companyId: string): Observable<any> {
        try {
            return this.http.post(environment.api + table + '/' + companyId, null);
        } catch (error) {
            console.error(error);
            const result = { data: [] };
            const observableResult: Observable<any> = of(result);
            return observableResult;
        }
    }

    getDashboardWhatsApp(companyId: string, interval: string): Observable<any> {
        try {
            return this.http.post(environment.api + 'DashboardWhatsApp/dashboard/' + companyId + '/' + interval, null);
        } catch (error) {
            console.error(error);
            const result = { data: [] };
            const observableResult: Observable<any> = of(result);
            return observableResult;
        }
    }

    getDashboardMessages(companyId: string, interval: string): Observable<any> {
        try {
            return this.http.post(environment.api + 'DashboardWhatsApp/messages/' + companyId + '/' + interval, null);
        } catch (error) {
            console.error(error);
            const result = { data: [] };
            const observableResult: Observable<any> = of(result);
            return observableResult;
        }
    }

    getDashboardUsers(companyId: string, interval: string): Observable<any> {
        try {
            return this.http.post(environment.api + 'DashboardWhatsApp/users/' + companyId + '/' + interval, null);
        } catch (error) {
            console.error(error);
            const result = { data: [] };
            const observableResult: Observable<any> = of(result);
            return observableResult;
        }
    }

    getDashboardArrangements(companyId: string, interval: string): Observable<any> {
        try {
            return this.http.post(environment.api + 'DashboardWhatsApp/arrangements/' + companyId + '/' + interval, null);
        } catch (error) {
            console.error(error);
            const result = { data: [] };
            const observableResult: Observable<any> = of(result);
            return observableResult;
        }
    }
}
