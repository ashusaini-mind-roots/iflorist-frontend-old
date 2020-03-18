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

    createCompanyEmployee(company_id,name,email,status_id,phone_number,image,active,system_account) {

        const formData = new FormData();
        //formData.append('image', image);
        formData.append('name', name);
        formData.append('image', image);
        formData.append('email', email);
        formData.append('status_id', status_id);
        formData.append('phone_number', phone_number);
        formData.append('active', active);
        formData.append('system_account', system_account);
        formData.append('company_id', company_id);
        

        let header = new HttpHeaders();

        header.set('Content-Type','multipart/form-data');
        
        return this.http.post(`${environment.apiUrl}/companyemployee/create`, formData,{headers: header});
    }

    updateEmployee(id,name,email,status_id,phone_number,image,active/*,store_id*/,system_account) {

        const formData = new FormData();
        //formData.append('image', image);
        //formData.append('id', id);
        formData.append('name', name);
        formData.append('image', image);
        formData.append('email', email);
        formData.append('status_id', status_id);
        formData.append('phone_number', phone_number);
        formData.append('active', active);
        /*formData.append('store_id', store_id);*/
        formData.append('system_account', system_account);
        let header = new HttpHeaders();

        header.set('Content-Type','multipart/form-data');
        
        return this.http.post(`${environment.apiUrl}/companyemployee/update/${id}`, formData,{headers: header});
    }

    getEmployee(employee_id): Observable<any>{
        return this.http.get(`${environment.apiUrl}/companyemployee/getById/${employee_id}`/*,{responseType: 'blob'}*/);
    }

    getEmployeeImage(employee_id): Observable<any>{
        return this.http.get(`${environment.apiUrl}/companyemployee/getImageById/${employee_id}`,{responseType: 'blob'});
    }

    deleteEmployee(id)
    {
        return this.http.delete(`${environment.apiUrl}/companyemployee/delete/${id}`);
    }


}
