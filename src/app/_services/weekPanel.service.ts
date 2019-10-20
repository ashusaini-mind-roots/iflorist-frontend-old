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

  getSevenDays(store_id, week): Observable<any> {
    // console.log(`${environment.apiUrl}/store/all`);
     return this.http.get(`${environment.apiUrl}/daily_revenue/seven_days_week/${store_id}/${week}`);
  }
  getWeeks(year): Observable<any> {
    // console.log(`${environment.apiUrl}/store/all`);
    return this.http.get(`${environment.apiUrl}/week/week_by_year/${year}`);
  }
}
