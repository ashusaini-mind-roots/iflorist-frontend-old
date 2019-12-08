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

  createStore(image,store_name,contact_email,contact_phone,zip_code,address,city,state) {
      //return this.http.post(`${environment.apiUrl}/store/create`, {store_name, contact_email, contact_phone, zip_code, address} );
      const formData = new FormData();
      //formData.append('image', image);
      //formData.append('id', id);
      formData.append('store_name', store_name);
      formData.append('image', image);
      formData.append('contact_email', contact_email);
      formData.append('contact_phone', contact_phone);
      formData.append('zip_code', zip_code);
      formData.append('address', address);
      formData.append('city', city);
      formData.append('state', state);
      
      let header = new HttpHeaders();

      header.set('Content-Type','multipart/form-data');
      
      return this.http.post(`${environment.apiUrl}/store/create`, formData,{headers: header});
  }

  updateStore(store_id,store_name,contact_email,contact_phone,zip_code,address){
      console.log(contact_email)
      console.log(`${environment.apiUrl}/store/update/${store_id}`)
      return this.http.put(`${environment.apiUrl}/store/update/${store_id}`, {store_name, contact_email, contact_phone, zip_code, address} );
  }

  getStore(store_id): Observable<any>{
      console.log(`${environment.apiUrl}/store/getById/${store_id}`)
      return this.http.get(`${environment.apiUrl}/store/getById/${store_id}`);
  }


}
