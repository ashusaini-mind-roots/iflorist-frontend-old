import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {retry, catchError} from 'rxjs/operators';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CostOfFreshService{

  constructor(
      private http: HttpClient
  ) { }

  getMasterOverviewWeekly(cosf_of, store, year): Observable<any> {
    // console.log(`${environment.apiUrl}/store/all`);
     return this.http.get(`${environment.apiUrl}/master_overview_weekly/master_overview_weekly_of/${cosf_of}/${store}/${year}`);
  }

}
