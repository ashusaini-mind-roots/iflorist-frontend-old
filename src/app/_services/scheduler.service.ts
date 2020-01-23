import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { map } from 'rxjs/operators';
// import {retry, catchError} from 'rxjs/operators';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SchedulerService{

  constructor(
      private http: HttpClient
  ) { }

    getProjWeeklyRev = function (store_id,week_id) {
        return this.http.get(`${environment.apiUrl}/weekly_projection_percent_revenue/proj_weekly_revenue/${store_id}/${week_id}`);
    }
    getTargetCOL = function (store_id,week_id) {
        return this.http.get(`${environment.apiUrl}/target_percentage/${store_id}/${week_id}`);
    }
    getScheduledPayroll = function (store_id,week_id) {
        return this.http.get(`${environment.apiUrl}/master_overview_weekly/scheduled_payroll_col/${store_id}/${week_id}`);
    }
    getScheduleInformation = function (store_id,week_id) {
        return this.http.get(`${environment.apiUrl}/schedule/all/${store_id}/${week_id}`);
    }
    updateOrAdd = function (year, week_id, schedule_days) {
        return this.http.post(`${environment.apiUrl}/schedule/update_or_add/`, {year, week_id, schedule_days} );
    }
    getCategoriesEmployees = function (store_id) {
        return this.http.get(`${environment.apiUrl}/schedule/category_employee/${store_id}`);
    }
}
