import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {retry, catchError} from 'rxjs/operators';
import { environment } from '@environments/environment';

@Injectable({
    providedIn: 'root'
})
export class EmployeeService{
    constructor(
        private http: HttpClient
    ) { }

    getEmployees(store_id){
        return this.http.get(`${environment.apiUrl}/employee/allActiveAndInactive/${store_id}`);
    }

    createEmployee(name,email,category_id,status_id,work_man_comb_id,phone_number,image,overtimeelegible,hourlypayrate,active,store_id,year_pay,system_account) {

        
        const formData = new FormData();
        //formData.append('image', image);
        formData.append('name', name);
        formData.append('image', image);
        formData.append('email', email);
        formData.append('category_id', category_id);
        formData.append('status_id', status_id);
        formData.append('work_man_comp_id', work_man_comb_id);
        formData.append('phone_number', phone_number);
        formData.append('overtimeelegible', overtimeelegible);
        formData.append('hourlypayrate', hourlypayrate);
        formData.append('active', active);
        formData.append('store_id', store_id);
        formData.append('year_pay', year_pay);
        formData.append('system_account', system_account);
        

        let header = new HttpHeaders();

        header.set('Content-Type','multipart/form-data');
        
        return this.http.post(`${environment.apiUrl}/employee/create`, formData,{headers: header});
    }

    updateEmployee(id,name,email,category_id,status_id,work_man_comb_id,phone_number,image,overtimeelegible,hourlypayrate,active/*,store_id*/,year_pay,system_account) {

        
        const formData = new FormData();
        //formData.append('image', image);
        //formData.append('id', id);
        formData.append('name', name);
        formData.append('image', image);
        formData.append('email', email);
        formData.append('category_id', category_id);
        formData.append('status_id', status_id);
        formData.append('work_man_comp_id', work_man_comb_id);
        formData.append('phone_number', phone_number);
        formData.append('overtimeelegible', overtimeelegible);
        formData.append('hourlypayrate', hourlypayrate);
        formData.append('active', active);
        /*formData.append('store_id', store_id);*/
        formData.append('year_pay', year_pay);
        formData.append('system_account', system_account);
        

        let header = new HttpHeaders();

        header.set('Content-Type','multipart/form-data');
        
        return this.http.post(`${environment.apiUrl}/employee/update/${id}`, formData,{headers: header});
    }
	
	changeAdminStore(employee_id,store_id)
	{
		const formData = new FormData();
        //formData.append('image', image);
        //formData.append('id', id);
        formData.append('employee_id', employee_id);
        formData.append('store_id', store_id);
        
        let header = new HttpHeaders();

        header.set('Content-Type','multipart/form-data');
        
        return this.http.post(`${environment.apiUrl}/employee/changeAdminStore`, formData,{headers: header});
	}

    getEmployee(employee_id): Observable<any>{
        return this.http.get(`${environment.apiUrl}/employee/getById/${employee_id}`/*,{responseType: 'blob'}*/);
    }

    getEmployeeImage(employee_id): Observable<any>{
        return this.http.get(`${environment.apiUrl}/employee/getImageById/${employee_id}`,{responseType: 'blob'});
    }
	
	getImageEmployeeByUser(user_id): Observable<any>{
        return this.http.get(`${environment.apiUrl}/employee/getImageByUserId/${user_id}`,{responseType: 'blob'});
    }

    deleteEmployee(id)
    {
        return this.http.delete(`${environment.apiUrl}/employee/delete/${id}`);
    }

}
