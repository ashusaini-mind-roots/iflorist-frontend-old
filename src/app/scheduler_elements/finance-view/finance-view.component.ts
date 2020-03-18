import { Component, OnInit, Input } from '@angular/core';
import { SchedulerService } from "../../_services/scheduler.service";
import { UtilsService } from "../../_services/utils.service";
import { CheckRole } from "../../_helpers/check-role";

@Component({
  selector: 'app-finance-view',
  templateUrl: './finance-view.component.html',
  styleUrls: ['./finance-view.component.less']
})
export class FinanceViewComponent implements OnInit {

  employeesScheduleList: any[];
  @Input() selectedStorage: any;
  @Input() yearQuarter: any;
  @Input() selectedWeekItem: any;
  employeeStoreWeekId: any;
  cols:any;
  showToEdit:string = '';

  constructor(
      private schedulerService: SchedulerService,
      private utilService: UtilsService,
	  private checkRole: CheckRole,
  ) { }

  ngOnInit() {
    this.loadHeaders();
  }

  ngOnChanges(changes){
    if(this.selectedStorage && this.selectedWeekItem ){
      this.getScheduleInformation();
    }
  }

  getScheduleInformation = function () {
    this.schedulerService.getScheduleInformation(this.selectedStorage.id,this.selectedWeekItem).subscribe((response: any) =>{
      this.employeeStoreWeekId = response.employee_store_week_id;
      this.parseScheduleInformationResponse(response.categories_schedules, response.dates_of_week);
    });
  }

  loadHeaders(){
    this.cols = [
      { field: 'name', header: 'Name' },
      { field: 'category_name', header: 'Job Title' },
      { field: 'total_minutes_at_week', header: 'Hours Scheduled' },
      { field: 'hourly_rate', header: 'Hourly Rate' },
      //{ field: 'total_cost', header: 'Total Cost' },
    ];
	
	if(this.hasAccesTs())
	{
		this.cols.push({ field: 'total_cost', header: 'Total Cost' });
	}
  }

  parseScheduleInformationResponse = function(categories_schedules,dates_of_week){
    var empScheList: any[] = [];
    for(var i = 0 ; i < categories_schedules.length ; i++){
      for(var j = 0 ; j < categories_schedules[i].employees.length ; j++){
        for(var k = 0 ; k < categories_schedules[i].employees[j].schedule_days.length ; k++){
          categories_schedules[i].employees[j].total_hours = this.utilService.ParseMinutesToHoursFormat(categories_schedules[i].employees[j].total_minutes_at_week);
          var schedul = categories_schedules[i].employees[j].schedule_days[k];
          schedul.date = dates_of_week[k];
          schedul.array_position = k;
          if(schedul.time_in != undefined)
            schedul.time_in = this.utilService.getStringTimeFormat(new Date(schedul.time_in));
          if(schedul.time_out != undefined)
            schedul.time_out = this.utilService.getStringTimeFormat(new Date(schedul.time_out));
        }
        categories_schedules[i].total_time = 0.0/*this.calcEmployeesTotalHours(this.categories_schedules[i].employees)*/;
      }
    }
    for(var l = 0 ; l < categories_schedules.length ; l++){
      if(categories_schedules[l].employees.length > 0){
        empScheList = empScheList.concat(categories_schedules[l].employees);
      }
    }
    return this.employeesScheduleList = empScheList;
  }

  calcTimesDifferenceMinutes_Util = function (time_in,time_out,break_time)
  {
    var minutesTotal = 0;
    if(time_in != undefined && time_out != undefined){
      if(break_time == undefined) break_time = 0;
      var time_inn = "2020-10-10:" + time_in;
      var time_outt = "2020-10-10:" + time_out;
      minutesTotal = (this.utilService.diffDateTime(time_inn,time_outt).totalmin - break_time);
    }
    return minutesTotal;
  }


  calcEmployeesTotalHours = function (employee) {
    var totalhours = 0;
    var totalTotal = 0;

    totalhours = 0;
    for(var j = 0 ; j < employee.schedule_days.length ; j++){
      var schedule = employee.schedule_days[j];
      totalhours += this.calcTimesDifferenceMinutes_Util(schedule.time_in, schedule.time_out, schedule.break_time);

    }
    // totalTotal += totalhours;
    employee.total_minutes_at_week = totalhours;
    employee.total_hours = this.utilService.ParseMinutesToHoursFormat(employee.total_minutes_at_week);
    return employee.total_hours;
  }

  calcTimesDifference = function (time_in, time_out, break_time) {
    if(time_in != undefined && time_out != undefined && time_in != time_out){
      if(break_time == undefined)
        break_time = 0;

      var startDT = time_in.toString().split(':');
      var obstartDT = new Date();
      obstartDT.setHours(startDT[0]);
      obstartDT.setMinutes(startDT[1]);
      obstartDT.setSeconds(0);

      var endDT = time_out.toString().split(':');
      var obendDT = new Date();
      obendDT.setHours(endDT[0]);
      obendDT.setMinutes(endDT[1]);
      obendDT.setSeconds(0);


      var minutesTotal = (this.utilService.diffDateTime(obstartDT,obendDT).totalmin - break_time);
      var h = Math.floor(minutesTotal / 60);
      var m = minutesTotal % 60;
      var hh = h < 10 ? '0' + h : h;
      var mm = m < 10 ? '0' + m : m;
      return hh + ':' + mm;
    }
    return '00' + ':' + '00';
  }

  updateSchedulesByCategory = function(/*employees*/schedule_days,category_name,employee_id){
        var esw_array = new Array();

        var asw_toSend = JSON.parse(JSON.stringify( schedule_days ));
        for(var j = 0 ; j < asw_toSend.length ; j++){
            if(asw_toSend[j].time_in != undefined) {
                asw_toSend[j].time_in = asw_toSend[j].time_in.toLocaleString("en-US", { hour12: false });
            }
            if(asw_toSend[j].time_out != undefined)
                asw_toSend[j].time_out = asw_toSend[j].time_out.toLocaleString("en-US", { hour12: false });
            asw_toSend[j].category_name = category_name;
        }

        var schedule_to_send = JSON.stringify(asw_toSend);
        this.schedulerService.updateOrAdd(this.yearQuarter.year,this.selectedWeekItem,schedule_to_send,employee_id)
          .subscribe(
                  response=> {
                    this.updateIdToNewSchedulesTimesAdded(response.schedules_added, response.employee_id);
                  },
                  error => {
                      console.log(error)
                      // this.error = error;
                      // this.loading = false;
                  }
              );
  }

  updateIdToNewSchedulesTimesAdded(schedules_added,employee_id){
    for (let i = 0 ; i < this.employeesScheduleList.length ; i++){
      if(this.employeesScheduleList[i].employee_id == employee_id){
        for(let j = 0 ; j < schedules_added.length ; j++){
          let found = this.employeesScheduleList[i].schedule_days.find(e => e.day_of_week == schedules_added[j].day_of_week)
          if(found){
            found.id = schedules_added[j].id;
          }
        }
      }
    }
  }

  get hasAcces() {
        if(this.checkRole.isRoot() || this.checkRole.isCompanyAdmin() || this.checkRole.isStoreManager())
		  return true;
		else return false;
	}
	
    hasAccesTs() {
        if(this.checkRole.isRoot() || this.checkRole.isCompanyAdmin() || this.checkRole.isStoreManager())
		  return true;
		else return false;
	}





}

