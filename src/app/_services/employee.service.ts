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
        console.log(`${environment.apiUrl}/employee/all/${store_id}`)
        return this.http.get(`${environment.apiUrl}/employee/all/${store_id}`);
    }

    createEmployee(name,email,category_id,status_id,work_man_comb_id,phone_number,image,overtimeelegible,hourlypayrate,active,store_id) {
        console.log(image); 
        /*const httpOptions = {
            headers: new HttpHeaders({
              'Content-Type':  'multipart/form-data',
              'Accept': 'application/json'
            })
          };*/

        
        //header.append('Accept','application/json');

        //console.log(header);

        //let options = new RequestOptions()

          
        
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
        

        let header = new HttpHeaders();

        header.set('Content-Type','multipart/form-data');
        
        return this.http.post(`${environment.apiUrl}/employee/create`, formData,{headers: header});
    }

}
