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
     return this.http.get(`${environment.apiUrl}/app_user/all/${store_id}`);
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
  }
  
  getAppUser(id): Observable<any> {
     return this.http.get(`${environment.apiUrl}/app_user/getAppUser/${id}`);
  }
}
