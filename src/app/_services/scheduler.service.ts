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
    getScheduledPayrollByQuarter = function (year, store_id,quarter) {
        return this.http.get(`${environment.apiUrl}/master_overview_weekly/scheduled_payroll_by_quarter/${year}/${store_id}/${quarter}`);
    }
    getScheduleInformation = function (store_id,week_id) {
        return this.http.get(`${environment.apiUrl}/schedule/all/${store_id}/${week_id}`);
    }
    updateOrAdd = function (year, week_id, schedule_days ,employee_id) {
        return this.http.post(`${environment.apiUrl}/schedule/update_or_add/`, {year, week_id, schedule_days, employee_id} );
    }
    getCategoriesEmployees = function (store_id) {
        return this.http.get(`${environment.apiUrl}/schedule/category_employee/${store_id}`);
    }

	getSevenDaysNumber(week_id)
	{
		return this.http.get(`${environment.apiUrl}/schedule/seven_days_number/${week_id}`);
	}
	
	updateTargetCOL = function (store_id,week_id,target_percentage) {
        return this.http.post(`${environment.apiUrl}/target_percentage/update_create_target_percentage/`, {store_id,week_id,target_percentage} );
    }

    // getSevenDays(store_id, week_id): Observable<any> {
  //   // console.log(`${environment.apiUrl}/store/all`);
  //    return this.http.get(`${environment.apiUrl}/daily_revenue/seven_days_week/${store_id}/${week_id}`);
  // }
  // getWeeks(year): Observable<any> {
  //   // console.log(`${environment.apiUrl}/store/all`);
  //   return this.http.get(`${environment.apiUrl}/week/week_by_year/${year}`);
  // }
  // getInvoices(cost_of,store_id, week_id): Observable<any> {
  //   return this.http.get(`${environment.apiUrl}/invoice/all/${cost_of}/${store_id}/${week_id}`);
  // }
  // createInvoice(cost_of, invoice_number,invoice_name,total,store_id,week_id) {
  //   return this.http.post(`${environment.apiUrl}/invoice/create`,
  //       {
  //         "invoice_number":  invoice_number,
  //         "invoice_name":  invoice_name,
  //         "total":  total,
  //         "store_id": store_id,
  //         "week_id": week_id,
  //         "cost_of": cost_of,
  //       });
  //
  // }
  // getProjWeeklyRev(store_id, week_id) : Observable<any> {
  //   return this.http.get(`${environment.apiUrl}/weekly_projection_percent_revenue/proj_weekly_revenue/${store_id}/${week_id}`);
  // }
  // getTarget(cost_of) : Observable<any> {
  //   return this.http.get(`${environment.apiUrl}/weekly_projection_percent_costs/target/${cost_of}`);
  // }
  //
  // updateDay(id,merchandise,wire,delivery){
  //     return this.http.put(`${environment.apiUrl}/daily_revenue/update/${id}`, {merchandise,wire,delivery} );
  // }

}
