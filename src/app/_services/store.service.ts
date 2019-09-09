import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
     return this.http.get(`${environment.apiUrl}/store/all`)
         .pipe(
             retry(1),
         );
  }

    createStore(store_name,contact_email,contact_phone,zip_code,address) {
        // store_name: $scope.store.store_name, contact_email: $scope.store.contact_email,
        // contact_phone: $scope.store.contact_phone, zip_code: $scope.store.zip_code,
        // address: $scope.store.address},
        return this.http.post(`${environment.apiUrl}/store/create`, {store_name, contact_email, contact_phone, zip_code, address} );
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
