import {Component, Input, OnInit} from '@angular/core';
import { SchedulerService } from "../../_services/scheduler.service";
import { UtilsService } from "../../_services/utils.service";
import { StoreSubscriberService } from "../../_services/storeSubscriber.service";

@Component({
  selector: 'app-scheduler-calendar-view',
  templateUrl: './scheduler-calendar-view.component.html',
  styleUrls: ['./scheduler-calendar-view.component.less']
})
export class SchedulerCalendarViewComponent implements OnInit {

  @Input() selectedStorage: any;
  @Input() yearQuarter: any;
  @Input() selectedWeekItem: any;
  categoriesEmployeesList: any[];
  categoriesEmployeesListSelectedItem: any;
  employeesListSelected: any;
  employeesList: any[];
  employeesList_add_modal: any[];
  employeesListSelected_add_modal: any;
  employeesScheduleList: any[];//parse data from the server, the core of all the information here

  employeesToShow: any[];
  seven_days_dates: any[];

  employee_scheduler_day_to_edit: any;
  visible_edit_day_modal: boolean = false;
  visible_add_day_modal: boolean = false;

  time_in: any;
  time_out: any;
  break_time: any;

  add_time_in: any;
  add_time_out: any;
  add_break_time: any;

  add_week_day_number: any;
  employee_scheduler_day_to_save: any;
  date_toshow: any;

  constructor(
      private schedulerService: SchedulerService,
      private utilService: UtilsService,
      private storeSubscriberService: StoreSubscriberService,//service used to receive store from top bar stores combobox
  ) {
    storeSubscriberService.subscribe(this,function (ref,store) {
      ref.receiveStorage(store);
    });
    this.employeesToShow = [];
    this.seven_days_dates = [];
    this.employee_scheduler_day_to_edit = {};
  }

  ngOnInit() {
    this.getCategoriesEmployees();
    this.employeesListSelected = -1; //select -All- as default on employees combo
  }

  ngOnChanges(changes){
    if(this.selectedStorage && this.selectedWeekItem ){
      this.getScheduleInformation();
    }
  }

  getScheduleInformation = function () {
    this.schedulerService.getScheduleInformation(this.selectedStorage.id,this.selectedWeekItem).subscribe((response: any) =>{
      this.parseScheduleInformationResponse(response.categories_schedules, response.dates_of_week);
      this.populateEmployeeToShow(this.categoriesEmployeesListSelectedItem, this.employeesListSelected);
    });
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
          schedul.employee_name = categories_schedules[i].employees[j].name;
          schedul.category_name = categories_schedules[i].category_name;
          schedul.employee_id = categories_schedules[i].employees[j].employee_id;
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

  onCategorySelected(event: any){
    this.populateEmployeesCombo(event.target.value);
    this.populateEmployeeToShow(this.categoriesEmployeesListSelectedItem, this.employeesListSelected);
  }
  onEmployeeSelected(event:any){
    this.populateEmployeeToShow(this.categoriesEmployeesListSelectedItem, this.employeesListSelected);
  }

  receiveStorage(storage){
    this.selectedStorage = storage;
    this.getCategoriesEmployees();
  }

  getCategoriesEmployees = function () {
    this.schedulerService.getCategoriesEmployees(this.selectedStorage.id).subscribe((response: any) =>{
      this.categoriesEmployeesList = response.categories_employees;
      if(this.categoriesEmployeesList && this.categoriesEmployeesList.length > 0) {
        this.categoriesEmployeesListSelectedItem = this.categoriesEmployeesList[0].id;
        this.populateEmployeesCombo(this.categoriesEmployeesListSelectedItem);
      }
    });
  }

  populateEmployeesCombo = function (category_id) {
    for(let i=0 ; i<this.categoriesEmployeesList.length ; i++){
        if(this.categoriesEmployeesList[i].id == category_id ) {
          this.employeesList = this.categoriesEmployeesList[i].employees;
          this.employeesList_add_modal = this.employeesList.map(x => Object.assign([], x));
          break;
        }
    }
  }

  populateEmployeeToShow = function(category_id, employee_id){
    if(employee_id == -1){//show all employees
      this.employeesToShow = []/*this.employeesScheduleList*/;
      for (let i = 0 ; i < this.employeesScheduleList.length ; i++){
        let employee = this.employeesScheduleList[i];
        if(employee.category_id ==  category_id){
            this.employeesToShow.push(employee);
        }
      }
    }
    else {
       this.employeesToShow = [];
       for (let i = 0 ; i < this.employeesScheduleList.length ; i++){
          let employee = this.employeesScheduleList[i];
          if(employee.employee_id == employee_id && employee.category_id ==  category_id){
              // this.employeeToShow = employee;
              this.employeesToShow.push(employee);
              break;
          }
       }
    }
    if(this.employeesToShow.length > 0)
      this.seven_days_dates = this.employeesToShow[0].schedule_days;
  }

  showEdit_day_modal = function(day, time_in, time_out, break_time){
    this.date_toshow = day.date;
    this.time_in = time_in;
    this.time_out = time_out;
    this.break_time = break_time;

    this.employee_scheduler_day_to_edit = day;
    this.visible_edit_day_modal = true;
  }

  getSchedule_days = function(category_id, employee_id){
    for (let i = 0 ; i < this.employeesScheduleList.length ; i++){
      let employee = this.employeesScheduleList[i];
      if(employee.employee_id == employee_id && employee.category_id ==  category_id){
        return employee.schedule_days;
      }
    }
    return undefined;
  }

  editSchedule = function(){
    if(this.employee_scheduler_day_to_edit){
      this.employee_scheduler_day_to_edit.time_in = this.time_in;
      this.employee_scheduler_day_to_edit.time_out = this.time_out;
      this.employee_scheduler_day_to_edit.break_time = this.break_time;
      let schedule_days = this.getSchedule_days(this.categoriesEmployeesListSelectedItem,this.employee_scheduler_day_to_edit.employee_id);

      if(schedule_days != undefined && this.employee_scheduler_day_to_edit){
        this.updateSchedulesByCategory(schedule_days,this.employee_scheduler_day_to_edit.category_name, this.employee_scheduler_day_to_edit.employee_id);
      }
    }
    this.visible_edit_day_modal = false;
  }



  updateSchedulesByCategory = function(schedule_days,category_name,employee_id){
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
              // this.loading = false;
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

  getDays(weekDay){
    let days: any[] = [];
    if(this.employeesToShow.length > 0){
        for (let i = 0 ; i < this.employeesToShow.length ; i++){
          days.push(this.employeesToShow[i].schedule_days[weekDay]);
        }
    }
    return days;
  }

  hasShift(weekDay){
    if(this.employeesToShow.length > 0){
      for (let i = 0 ; i < this.employeesToShow.length ; i++){
        if(this.employeesToShow[i].schedule_days[weekDay].time_in)
          return this.employeesToShow[i].schedule_days[weekDay];
      }
    }
    return undefined;
  }

  showAdd_day_modal(week_day_number){
    this.visible_add_day_modal = true;
    this.add_week_day_number = week_day_number;
    this.add_time_in = undefined;
    this.add_time_out = undefined;
    this.add_break_time = undefined;
    this.employeesListSelected_add_modal = this.employeesList_add_modal[0].id;
    this.setDataTo_add(this.employeesListSelected_add_modal);
  }

  saveSchedule = function(){
      let employee_scheduler_day_to_save = undefined;

      this.setShiftToDayToSaveSchedule(this.add_time_in, this.add_time_out, this.add_break_time);

      let schedule_days = this.getSchedule_days(this.categoriesEmployeesListSelectedItem,this.employeesListSelected_add_modal);
      if(schedule_days != undefined && this.employee_scheduler_day_to_save){
        this.updateSchedulesByCategory(schedule_days,this.employee_scheduler_day_to_save.category_name, this.employee_scheduler_day_to_save.employee_id);
      }

      this.visible_edit_day_modal = false;
  }

  setShiftToDayToSaveSchedule(add_time_in,add_time_out,add_break_time){
    this.employee_scheduler_day_to_save = undefined;
      for (let i = 0 ; i < this.employeesScheduleList.length ; i++){
          if(this.employeesScheduleList[i].employee_id == this.employeesListSelected_add_modal){
            for (let j = 0 ; j < this.employeesScheduleList[i].schedule_days.length ; j++){
                if(this.employeesScheduleList[i].schedule_days[j].array_position == this.add_week_day_number){
                  this.employeesScheduleList[i].schedule_days[j].time_in = add_time_in;
                  this.employeesScheduleList[i].schedule_days[j].time_out = add_time_out;
                  this.employeesScheduleList[i].schedule_days[j].break_time = add_break_time;
                  this.employee_scheduler_day_to_save = this.employeesScheduleList[i].schedule_days[j];
                  break;
                }
            }
          }
      }
  }

  getDayByEmployeeId_weekDay_number(employee_id,week_day_number){
      for (let i = 0 ; i < this.employeesScheduleList.length ; i++){
        if(this.employeesScheduleList[i].employee_id == this.employeesListSelected_add_modal){
          for (let j = 0 ; j < this.employeesScheduleList[i].schedule_days.length ; j++){
            if(this.employeesScheduleList[i].schedule_days[j].array_position == this.add_week_day_number){
              return this.employeesScheduleList[i].schedule_days[j];
              break;
            }
          }
        }
      }
      return undefined;
  }

  employeesListSelected_add_modal_change(event: any){
    this.setDataTo_add(event.target.value);

  }
  setDataTo_add(employee_id){
    let day = this.getDayByEmployeeId_weekDay_number(employee_id,this.add_week_day_number);
    if(day)
      this.date_toshow = day.date;
    if(day){
      this.add_time_in = day.time_in;
      this.add_time_out = day.time_out;
      this.add_break_time = day.break_time;
    }
    else {
      this.add_time_in = undefined;
      this.add_time_out = undefined;
      this.add_break_time = undefined;
    }
  }
}
