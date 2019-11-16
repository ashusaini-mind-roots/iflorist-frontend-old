import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {retry, catchError} from 'rxjs/operators';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SalesService {

  constructor(
      private http: HttpClient
  ) { }

  getSales(store_id, year, quarter): Observable<any> {
      console.log(`${environment.apiUrl}/daily_revenue/sales/${store_id}/${year}/${quarter}`)
      return this.http.get(`${environment.apiUrl}/daily_revenue/sales/${store_id}/${year}/${quarter}`);
  }

  updateDay(id,merchandise,wire,delivery){
    return this.http.put(`${environment.apiUrl}/daily_revenue/update/${id}`, {merchandise,wire,delivery} );
  }

}
