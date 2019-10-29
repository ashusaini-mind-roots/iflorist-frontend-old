import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {retry, catchError} from 'rxjs/operators';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectionService {

  constructor(
      private http: HttpClient
  ) { }

  getProjectionList(store_id,year): Observable<any> {
    return this.http.get(`${environment.apiUrl}/weekly_projection_percent_revenue/projections/${store_id}/${year}`);
  }

  updateProyection(proyection_id,amt_total,adjust){
    return this.http.put(`${environment.apiUrl}/weekly_projection_percent_revenue/projections/update/${proyection_id}`, {amt_total,adjust} );
  }

}
