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
    // var empScheList = new Array();
    var empScheList: any[] = [];
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
    // return this.employeesScheduleList = categories_schedules;

    // console.log(categories_schedules)
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
      minutesTotal = (this.utilService.diffDateTime(time_in,time_out).totalmin - break_time);
    }
    return minutesTotal;
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

  calcTimesDifference = function (time_in, time_out, break_time) {
//console.log(time_in + "," + time_out + "," + break_time)
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
      console.log("totalmin:" + this.utilService.diffDateTime(obstartDT,obendDT).totalmin)
      var h = Math.floor(minutesTotal / 60);
      var m = minutesTotal % 60;
      var hh = h < 10 ? '0' + h : h;
      var mm = m < 10 ? '0' + m : m;
      return hh + ':' + mm;
    }
    return '00' + ':' + '00';
  }
}




// import { Component, OnInit, Input } from '@angular/core';
// import { SchedulerService } from "../../_services/scheduler.service";
// import { UtilsService } from "../../_services/utils.service";
//
// @Component({
//   selector: 'app-finance-view',
//   templateUrl: './finance-view.component.html',
//   styleUrls: ['./finance-view.component.less']
// })
// export class FinanceViewComponent implements OnInit {
//
//   employeesScheduleList: any[];
//   @Input() selectedStorage: any;
//   @Input() yearQuarter: any;
//   @Input() selectedWeekItem: any;
//   employeeStoreWeekId: any;
//   cols:any;
//   showToEdit:string = '';
//
//   constructor(
//       private schedulerService: SchedulerService,
//       private utilService: UtilsService,
//   ) { }
//
//   ngOnInit() {
//     this.loadHeaders();
//   }
//
//   ngOnChanges(changes){
//     if(this.selectedStorage && this.selectedWeekItem ){
//       console.log(this.selectedStorage);
//       console.log(this.yearQuarter);
//       console.log("pinga: " + this.selectedWeekItem);
//       this.getScheduleInformation();
//     }
//
//   }
//
//   getScheduleInformation = function () {
//     this.schedulerService.getScheduleInformation(this.selectedStorage.id,this.selectedWeekItem).subscribe((response: any) =>{
//       this.employeeStoreWeekId = response.employee_store_week_id;
//       this.parseScheduleInformationResponse(response.categories_schedules);
//       console.log(this.employeesScheduleList)
//     });
//   }
//
//   loadHeaders(){
//     this.cols = [
//       { field: 'name', header: 'Name' },
//       { field: 'category_name', header: 'Job Title' },
//       { field: 'total_minutes_at_week', header: 'Hours Scheduled' },
//       { field: 'hourly_rate', header: 'Hourly Rate' },
//       { field: 'total_cost', header: 'Total Cost' },
//     ];
//   }
//
//   parseScheduleInformationResponse = function(categories_schedules){
//     for(var i = 0 ; i < categories_schedules.length ; i++){
//       for(var j = 0 ; j < categories_schedules[i].employees.length ; j++){
//
//         for(var k = 0 ; k < categories_schedules[i].employees[j].schedule_days.length ; k++){
//           categories_schedules[i].employees[j].total_hours = this.utilService.ParseMinutesToHoursFormat(categories_schedules[i].employees[j].total_minutes_at_week);
//           var schedul = categories_schedules[i].employees[j].schedule_days[k];
//           if(schedul.time_in != undefined)
//             schedul.time_in = new Date(schedul.time_in);
//           if(schedul.time_out != undefined)
//             schedul.time_out = new Date(schedul.time_out);
//         }
//         //esta linea esta adicionada ahora, no estaba en el codigo viejo
//         categories_schedules[i].total_time = 0.0/*this.calcEmployeesTotalHours(this.categories_schedules[i].employees)*/;
//       }
//     }
//     return this.employeesScheduleList = categories_schedules;
//   }
//
//   calcTimesDifferenceMinutes_Util = function (time_in,time_out,break_time)
//   {
//     var minutesTotal = 0;
//     if(time_in != undefined && time_out != undefined){
//       if(break_time == undefined) break_time = 0;
//       minutesTotal = (this.utilService.diffDateTime(time_in,time_out).totalmin - break_time);
//     }
//     return minutesTotal;
//   }
//
//
//   calcEmployeesTotalHours = function (employees) {
//     var totalhours = 0;
//     var totalTotal = 0;
//
//     for(var i = 0 ; i < employees.length ; i++){
//       totalhours = 0;
//       for(var j = 0 ; j < employees[i].schedule_days.length ; j++){
//         var schedule = employees[i].schedule_days[j];
//         totalhours += this.calcTimesDifferenceMinutes_Util(schedule.time_in, schedule.time_out, schedule.break_time);
//       }
//       totalTotal += totalhours;
//       employees[i].total_minutes_at_week = totalhours;
//       employees[i].total_hours = this.ParseMinutesToHoursFormat(employees[i].total_minutes_at_week);
//     }
//     return totalTotal;
//   }
//
//   calcTimesDifference = function (time_in, time_out, break_time) {
// //console.log(time_in + "," + time_out + "," + break_time)
//     if(time_in != undefined && time_out != undefined && time_in != time_out){
//       if(break_time == undefined)
//         break_time = 0;
//
//       var startDT = time_in.toString().split(':');
//       var obstartDT = new Date();
//       obstartDT.setHours(startDT[0]);
//       obstartDT.setMinutes(startDT[1]);
//       obstartDT.setSeconds(0);
//
//       var endDT = time_out.toString().split(':');
//       var obendDT = new Date();
//       obendDT.setHours(endDT[0]);
//       obendDT.setMinutes(endDT[1]);
//       obendDT.setSeconds(0);
//
//
//       var minutesTotal = (this.utilService.diffDateTime(obstartDT,obendDT).totalmin - break_time);
// console.log("totalmin:" + this.utilService.diffDateTime(obstartDT,obendDT).totalmin)
//       var h = Math.floor(minutesTotal / 60);
//       var m = minutesTotal % 60;
//       var hh = h < 10 ? '0' + h : h;
//       var mm = m < 10 ? '0' + m : m;
//       return hh + ':' + mm;
//     }
//     return '00' + ':' + '00';
//   }
// }
//
//
