import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {retry, catchError} from 'rxjs/operators';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  constructor(
      private http: HttpClient
  ) { }

  getStoreList(): Observable<any> {
    // console.log(`${environment.apiUrl}/store/all`);
     return this.http.get(`${environment.apiUrl}/store/all`);
         // .pipe(
         //     retry(1),
         // );
  }

  createStore(image,store_name,contact_email,contact_phone,zip_code,address,city,state,target_percentage,projection_percentage,target_costof_goods,target_costof_fresh,
              sui,futa,social_security,medicare) {
      const formData = new FormData();
      formData.append('store_name', store_name);
      formData.append('image', image);
      formData.append('contact_email', contact_email);
      formData.append('contact_phone', contact_phone);
      formData.append('zip_code', zip_code);
      formData.append('address', address);
      formData.append('city', city);
      formData.append('state', state);
	  formData.append('target_percentage', target_percentage);
      formData.append('projection_percentage', target_percentage);
	  formData.append('target_costof_goods', target_costof_goods);
      formData.append('target_costof_fresh', target_costof_fresh);
      formData.append('sui', sui);
      formData.append('futa', futa);
      formData.append('social_security', social_security);
      formData.append('medicare', medicare);
      
      let header = new HttpHeaders();

      header.set('Content-Type','multipart/form-data');
      
      return this.http.post<any>(`${environment.apiUrl}/store/create`, formData,{headers: header});
  }
  
  uploadCsv(store_id,file,target_percentage) {
      //return this.http.post(`${environment.apiUrl}/store/create`, {store_name, contact_email, contact_phone, zip_code, address} );
      const formData = new FormData();
      //formData.append('image', image);
      //formData.append('id', id);
      formData.append('store_id', store_id);
	  formData.append('target_percentage', target_percentage);
      formData.append('file', file);
      
	  let header = new HttpHeaders();

      header.set('Content-Type','multipart/form-data');
      
      return this.http.post(`${environment.apiUrl}/store/setWeeklyProjectionPercentRevenues`, formData,{headers: header});
  }

  updateStore(store_id,store_name,contact_email,contact_phone,zip_code,address,city,state,target_percentage,image,target_costof_goods,target_costof_fresh,
              sui,futa,social_security,medicare){
	  
	  const formData = new FormData();
      formData.append('store_name', store_name);
      formData.append('image', image);
      formData.append('contact_email', contact_email);
      formData.append('contact_phone', contact_phone);
      formData.append('zip_code', zip_code);
      formData.append('address', address);
      formData.append('city', city);
      formData.append('state', state);
      formData.append('target_percentage', target_percentage);
	  formData.append('target_costof_goods', target_costof_goods);
      formData.append('target_costof_fresh', target_costof_fresh);
      formData.append('sui', sui);
      formData.append('futa', futa);
      formData.append('social_security', social_security);
      formData.append('medicare', medicare);
      
      let header = new HttpHeaders();

      header.set('Content-Type','multipart/form-data');
      
      return this.http.post<any>(`${environment.apiUrl}/store/update/${store_id}`, formData,{headers: header});
	  
      //return this.http.put(`${environment.apiUrl}/store/update/${store_id}`, {store_name, contact_email, contact_phone, zip_code, address, city, state,target_percentage} );
  }

  getStore(store_id): Observable<any>{
      console.log(`${environment.apiUrl}/store/getById/${store_id}`)
      return this.http.get(`${environment.apiUrl}/store/getById/${store_id}`);
  }
  
  getStoreImage(store_id): Observable<any>{
      return this.http.get(`${environment.apiUrl}/store/getImageById/${store_id}`,{responseType: 'blob'});
  }

    getEmployees(store_id): Observable<any>{
        console.log(`${environment.apiUrl}/employee/all/${store_id}`);
        return this.http.get(`${environment.apiUrl}/employee/all/${store_id}`);
    }


}
