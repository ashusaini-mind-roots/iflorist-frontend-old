import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {retry, catchError} from 'rxjs/operators';

import { environment } from '@environments/environment';
import { User } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class PlanService {
    constructor(private http: HttpClient) { }

    getAll():Observable<any>{
        return this.http.get<any>(`${environment.apiUrl}/plan/plans`)
        .pipe(
            retry(1),
            /*catchError(this.handleError)*/
        )
    }

    getByUser(userId: string):Observable<any>{
        return this.http.get<any>(`${environment.apiUrl}/plan/modulesbyuser/${userId}`)
        .pipe(
            retry(1),
            /*catchError(this.handleError)*/
        )
    }

    
}