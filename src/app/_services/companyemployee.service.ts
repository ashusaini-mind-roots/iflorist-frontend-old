import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {retry, catchError} from 'rxjs/operators';
import { environment } from '@environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CompanyemployeeService{
    constructor(
        private http: HttpClient
    ) { }

    getCompanyEmployees(company_id){
        return this.http.get(`${environment.apiUrl}/companyemployee/all/${company_id}`);
    }

    createCompanyemployee(name,company_id) {
        const formData = new FormData();
        //formData.append('image', image);
        formData.append('name', name);
        formData.append('company_id', company_id);

        let header = new HttpHeaders();
        header.set('Content-Type','multipart/form-data');

        return this.http.post(`${environment.apiUrl}/companyemployee/create`, formData,{headers: header});
    }


}
