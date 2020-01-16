import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {retry, catchError} from 'rxjs/operators';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppUserService {

  constructor(
      private http: HttpClient
  ) { }

  getAppUserList(store_id): Observable<any> {
    // console.log(`${environment.apiUrl}/store/all`);
     return this.http.get(`${environment.apiUrl}/app_user/all/${store_id}`);
         // .pipe(
         //     retry(1),
         // );
  }

  createAppUser(name,email,store_id,active) {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('store_id', store_id);
      formData.append('active', active);
      
      let header = new HttpHeaders();

      header.set('Content-Type','multipart/form-data');
      
      return this.http.post(`${environment.apiUrl}/app_user/create`, formData,{headers: header});
  }
  
  updateAppUser(id,name,email,store_id,active){
	  
	  const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('store_id', store_id);
      formData.append('active', active);
      
      let header = new HttpHeaders();

      header.set('Content-Type','multipart/form-data');
      
      return this.http.post(`${environment.apiUrl}/app_user/update/${id}`, formData,{headers: header});
	  
      //return this.http.put(`${environment.apiUrl}/store/update/${store_id}`, {store_name, contact_email, contact_phone, zip_code, address, city, state,target_percentage} );
  }
  
  getAppUser(id): Observable<any> {
    // console.log(`${environment.apiUrl}/store/all`);
     return this.http.get(`${environment.apiUrl}/app_user/getAppUser/${id}`);
         // .pipe(
         //     retry(1),
         // );
  }
}
