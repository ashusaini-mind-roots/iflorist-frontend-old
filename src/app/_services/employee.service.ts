import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

}
