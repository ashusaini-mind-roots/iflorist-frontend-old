import { Component, OnInit, Input } from '@angular/core';
import { SchedulerService } from "../../_services/scheduler.service";
import { UtilsService } from "../../_services/utils.service";

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
  ) { }

  ngOnInit() {
    this.loadHeaders();
  }

  ngOnChanges(changes){
    if(this.selectedStorage && this.selectedWeekItem ){
      console.log(this.selectedStorage);
      console.log(this.yearQuarter);
      console.log("pinga: " + this.selectedWeekItem);
      this.getScheduleInformation();
    }

  }

  getScheduleInformation = function () {
    this.schedulerService.getScheduleInformation(this.selectedStorage.id,this.selectedWeekItem).subscribe((response: any) =>{
      this.employeeStoreWeekId = response.employee_store_week_id;
      this.parseScheduleInformationResponse(response.categories_schedules);
      console.log(this.employeesScheduleList)
    });
  }

  loadHeaders(){
    this.cols = [
      { field: 'name', header: 'Name' },
      { field: 'category_name', header: 'Job Title' },
      { field: 'total_minutes_at_week', header: 'Hours Scheduled' },
      { field: 'hourly_rate', header: 'Hourly Rate' },
      { field: 'total_cost', header: 'Total Cost' },
    ];
  }

  parseScheduleInformationResponse = function(categories_schedules){
    for(var i = 0 ; i < categories_schedules.length ; i++){
      for(var j = 0 ; j < categories_schedules[i].employees.length ; j++){

        for(var k = 0 ; k < categories_schedules[i].employees[j].schedule_days.length ; k++){
          categories_schedules[i].employees[j].total_hours = this.utilService.ParseMinutesToHoursFormat(categories_schedules[i].employees[j].total_minutes_at_week);
          var schedul = categories_schedules[i].employees[j].schedule_days[k];
          if(schedul.time_in != undefined)
            schedul.time_in = new Date(schedul.time_in);
          if(schedul.time_out != undefined)
            schedul.time_out = new Date(schedul.time_out);
        }
        //esta linea esta adicionada ahora, no estaba en el codigo viejo
        categories_schedules[i].total_time = 0.0/*this.calcEmployeesTotalHours(this.categories_schedules[i].employees)*/;
      }
    }
    return this.employeesScheduleList = categories_schedules;
  }

  calcTimesDifferenceMinutes_Util = function (time_in,time_out,break_time)
  {
    var minutesTotal = 0;
    if(time_in != undefined && time_out != undefined){
      if(break_time == undefined) break_time = 0;
      minutesTotal = (this.diffDateTime(time_in,time_out).totalmin - break_time);
    }
    return minutesTotal;
  }

  /* Function to calculate time difference between 2 datetimes (in Timestamp-milliseconds, or string English Date-Time)
   It can also be used the words: NOW for current date-time, and TOMORROW for the next day (the 0:0:1 time)
   Returns an object with this items {days, hours, minutes, seconds, totalhours, totalmin, totalsec}
   */
  diffDateTime = function(startDT, endDT){
    // JavaScript & jQuery Course - https://coursesweb.net/javascript/
    // if paramerer is string, only the time hh:mm:ss (with, or without AM/PM), create Date object for current date-time,
    // and adds hour, minutes, seconds from paramerer
    //else, if the paramerer is "now", sets Date object with current date-time
    //else, if the paramerer is "tomorrow", sets Date object with current date, and the hour 24 + 1 second
    // else create Date object with date time from startDT and endDT
    if(typeof startDT == 'string' && startDT.match(/^[0-9]{1,2}:[0-9]{1,2}:[0-9]{1,2}[amp ]{0,3}$/i)){
      startDT = startDT.match(/^[0-9]{1,2}:[0-9]{1,2}:[0-9]{1,2}/);
      startDT = startDT.toString().split(':');
      var obstartDT = new Date();
      obstartDT.setHours(startDT[0]);
      obstartDT.setMinutes(startDT[1]);
      obstartDT.setSeconds(startDT[2]);
    }
    else if(typeof startDT == 'string' && startDT.match(/^now$/i)) var obstartDT = new Date();
    else if(typeof startDT == 'string' && startDT.match(/^tomorrow$/i)){
      var obstartDT = new Date();
      obstartDT.setHours(24);
      obstartDT.setMinutes(0);
      obstartDT.setSeconds(1);
    }
    else var obstartDT = new Date(startDT);

    if(typeof endDT == 'string' && endDT.match(/^[0-9]{1,2}:[0-9]{1,2}:[0-9]{1,2}[amp ]{0,3}$/i)){
      endDT = endDT.match(/^[0-9]{1,2}:[0-9]{1,2}:[0-9]{1,2}/);
      endDT = endDT.toString().split(':');
      var obendDT = new Date();
      obendDT.setHours(endDT[0]);
      obendDT.setMinutes(endDT[1]);
      obendDT.setSeconds(endDT[2]);
    }
    else if(typeof endDT == 'string' && endDT.match(/^now$/i)) var obendDT = new Date();
    else if(typeof endDT == 'string' && endDT.match(/^tomorrow$/i)){
      var obendDT = new Date();
      obendDT.setHours(24);
      obendDT.setMinutes(0);
      obendDT.setSeconds(1);
    }
    else var obendDT = new Date(endDT);

    // gets the difference in number of seconds
    // if the difference is negative, the hours are from different days, and adds 1 day (in sec.)
    var secondsDiff = (obendDT.getTime() - obstartDT.getTime()) > 0 ? (obendDT.getTime() - obstartDT.getTime()) / 1000 :  (86400000 + obendDT.getTime() - obstartDT.getTime()) / 1000;
    secondsDiff = Math.abs(Math.floor(secondsDiff));

    var oDiff = {

         // object that will store data returned by this function

      days : Math.floor(secondsDiff/86400),
      totalhours : Math.floor(secondsDiff/3600),      // total number of hours in difference
      totalmin : Math.floor(secondsDiff/60),    // total number of minutes in difference
      totalsec : secondsDiff,      // total number of seconds in difference
      hours : 0,
      minutes: 0,
      seconds: 0,
    };
    secondsDiff -= oDiff.days*86400;
    oDiff.hours = Math.floor(secondsDiff/3600);     // number of hours after days

    secondsDiff -= oDiff.hours*3600;
    oDiff.minutes = Math.floor(secondsDiff/60);     // number of minutes after hours

    secondsDiff -= oDiff.minutes*60;
    oDiff.seconds = Math.floor(secondsDiff);     // number of seconds after minutes

    return oDiff;
  }

  calcEmployeesTotalHours = function (employees) {
    var totalhours = 0;
    var totalTotal = 0;

    for(var i = 0 ; i < employees.length ; i++){
      totalhours = 0;
      for(var j = 0 ; j < employees[i].schedule_days.length ; j++){
        var schedule = employees[i].schedule_days[j];
        totalhours += this.calcTimesDifferenceMinutes_Util(schedule.time_in, schedule.time_out, schedule.break_time);
      }
      totalTotal += totalhours;
      employees[i].total_minutes_at_week = totalhours;
      employees[i].total_hours = this.ParseMinutesToHoursFormat(employees[i].total_minutes_at_week);
    }
    return totalTotal;
  }
}


