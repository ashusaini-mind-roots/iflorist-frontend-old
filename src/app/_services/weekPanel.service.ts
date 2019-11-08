import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {retry, catchError} from 'rxjs/operators';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WeekPanelService{

  constructor(
      private http: HttpClient
  ) { }

  getSevenDays(store_id, week_id): Observable<any> {
    // console.log(`${environment.apiUrl}/store/all`);
     return this.http.get(`${environment.apiUrl}/daily_revenue/seven_days_week/${store_id}/${week_id}`);
  }
  getWeeks(year): Observable<any> {
    // console.log(`${environment.apiUrl}/store/all`);
    return this.http.get(`${environment.apiUrl}/week/week_by_year/${year}`);
  }
  getInvoices(cost_of,store_id, week_id): Observable<any> {
    return this.http.get(`${environment.apiUrl}/invoice/all/${cost_of}/${store_id}/${week_id}`);
  }
  getNotes(store_id, week_id, year): Observable<any> {
    return this.http.get(`${environment.apiUrl}/note/all/${store_id}/${week_id}/${year}`);
  }
  createInvoice(cost_of, invoice_number,invoice_name,total,store_id,week_id) {
    return this.http.post(`${environment.apiUrl}/invoice/create`,
        {
          "invoice_number":  invoice_number,
          "invoice_name":  invoice_name,
          "total":  total,
          "store_id": store_id,
          "week_id": week_id,
          "cost_of": cost_of,
        });

  }
  getProjWeeklyRev(store_id, week_id) : Observable<any> {
    return this.http.get(`${environment.apiUrl}/weekly_projection_percent_revenue/proj_weekly_revenue/${store_id}/${week_id}`);
  }
  getTarget(cost_of) : Observable<any> {
    return this.http.get(`${environment.apiUrl}/weekly_projection_percent_costs/target/${cost_of}`);
  }

  updateDay(id,merchandise,wire,delivery){
      return this.http.put(`${environment.apiUrl}/daily_revenue/update/${id}`, {merchandise,wire,delivery} );
  }

  deleteNote(id)
  {
    return this.http.delete(`${environment.apiUrl}/note/delete/${id}`);
  }

  createNote(store_id,week_id,year,text)
  {
    return this.http.post(`${environment.apiUrl}/note/create`,
        {
          "store_id": store_id,
          "week_id": week_id,
          "year": year,
          "text":text
        });
  }

}
