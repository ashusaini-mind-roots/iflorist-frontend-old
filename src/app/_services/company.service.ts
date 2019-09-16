import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {retry, catchError} from 'rxjs/operators';

import { environment } from '@environments/environment';
import { User } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class CompanyService {
    constructor(private http: HttpClient) { }

    create(data:any):Observable<any>{
        return this.http.post<any>(`${environment.apiUrl}/company/create`,data);
    }

    existUser(data:any):Observable<any>{
        return this.http.post<any>(`${environment.apiUrl}/auth/exis_user`,data);
    }

    validateCard(data:any):Observable<any>{
        return this.http.post<any>(`${environment.apiUrl}/company/valid_card`,data);
    }

    validateCompany(data:any):Observable<any>{
        return this.http.post<any>(`${environment.apiUrl}/company/activate_company`,data);
    }

    
}