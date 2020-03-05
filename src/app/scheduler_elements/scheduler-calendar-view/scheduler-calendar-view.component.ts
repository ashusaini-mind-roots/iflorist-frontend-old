import {Component, Input, OnInit} from '@angular/core';
import { SchedulerService } from "../../_services/scheduler.service";
import { UtilsService } from "../../_services/utils.service";
import { StoreSubscriberService } from "../../_services/storeSubscriber.service";
// import {forEachComment} from "tslint";

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
  employeesScheduleList: any[];
  employeeToShow: any;
  employee_scheduler_day_to_edit: any;
  visible_edit_day_modal: boolean = false;

  time_in: any;
  time_out: any;
  break_time: any;

  constructor(
      private schedulerService: SchedulerService,
      private utilService: UtilsService,
      private storeSubscriberService: StoreSubscriberService,//service used to receive store from top bar stores combobox
  ) {
    storeSubscriberService.subscribe(this,function (ref,store) {
      ref.receiveStorage(store);
    });
    this.employeeToShow = {};
    this.employee_scheduler_day_to_edit = {};
  }

  ngOnInit() {
    this.getCategoriesEmployees();
  }

  ngOnChanges(changes){
    console.log("week on calendar view:" + this.selectedWeekItem)
    if(this.selectedStorage && this.selectedWeekItem ){
      console.log(this.selectedStorage);
      console.log(this.yearQuarter);
      this.getScheduleInformation();
    }
  }

  getScheduleInformation = function () {
    this.schedulerService.getScheduleInformation(this.selectedStorage.id,this.selectedWeekItem).subscribe((response: any) =>{
      // this.employeeStoreWeekId = response.employee_store_week_id;
      console.log("es aki la cosa on scheduler calendar view")
      //console.log(response);
      this.parseScheduleInformationResponse(response.categories_schedules, response.dates_of_week);
      console.log(this.employeesScheduleList)
    });
  }

  parseScheduleInformationResponse = function(categories_schedules,dates_of_week){
    // console.log(categories_schedules)
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
    console.log("mojon")
    console.log(empScheList)
    return this.employeesScheduleList = empScheList;
  }

  onCategorySelected(event: any){
    console.log("pingaaaaaaaa: ")
    console.log(event.target.value);
   // this.employeesListSelected  = [];
    // var foundStore = this.stores.filter(obj=>obj.id == value);
    this.populateEmployeesCombo(event.target.value);
  }
  onEmployeeSelected(event:any){
    console.log("employee selected")
    console.log(event.target.value);
    console.log(this.employeesListSelected)
    console.log(this.categoriesEmployeesListSelectedItem)
    this.populateEmployeeToShow(this.categoriesEmployeesListSelectedItem, event.target.value);
  }

  receiveStorage(storage){
    // console.log("pepetey::::")
    console.log(this.selectedStorage)

    // console.log("pepetey::::")
    this.selectedStorage = storage;
    this.getCategoriesEmployees();
  }

  getCategoriesEmployees = function () {
     // console.log("estorage--" + this.selectedStorage.id)
    this.schedulerService.getCategoriesEmployees(this.selectedStorage.id).subscribe((response: any) =>{
      this.categoriesEmployeesList = response.categories_employees;
      if(this.categoriesEmployeesList && this.categoriesEmployeesList.length > 0) {
        // console.log("categoriesEmployeesList");
        // console.log(this.categoriesEmployeesList)
        this.categoriesEmployeesListSelectedItem = this.categoriesEmployeesList[0].id;
        this.populateEmployeesCombo(this.categoriesEmployeesListSelectedItem);
        if(this.categoriesEmployeesList[0].employees.length > 0)
          this.employeesListSelected = this.categoriesEmployeesList[0].employees[0].id;
        // console.log("categoriesEmployeesListSelectedItem")
        // console.log(this.categoriesEmployeesListSelectedItem)
      }
    });
  }

  populateEmployeesCombo = function (category_id) {
    for(let i=0 ; i<this.categoriesEmployeesList.length ; i++){
        if(this.categoriesEmployeesList[i].id == category_id ) {
          this.employeesList = this.categoriesEmployeesList[i].employees;
         // this.employeesListSelected = this.categoriesEmployeesList[i].employees[0].id;
         // break;
        }
    }
  }

  populateEmployeeToShow = function(category_id, employee_id){
   // if(this.employeesScheduleList.length > 0){
   //  console.log(this.employeesScheduleList)
     for (let i = 0 ; i < this.employeesScheduleList.length ; i++){
        let employee = this.employeesScheduleList[i];
        if(employee.employee_id == employee_id && employee.category_id ==  category_id){
            this.employeeToShow = employee;
            break;
        }
     }
   // }
   console.log("Employee to show");
   console.log(this.employeeToShow);
  }

  showEdit_day_modal = function(day, time_in, time_out, break_time){
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
      let schedule_days = this.getSchedule_days(this.categoriesEmployeesListSelectedItem,this.employeesListSelected);
      if(schedule_days != undefined && this.employeeToShow){
        this.updateSchedulesByCategory(schedule_days,this.employeeToShow.category_name, this.employeeToShow.employee_id);
      }
    }
    this.visible_edit_day_modal = false;
  }

  updateSchedulesByCategory = function(schedule_days,category_name,employee_id){
    var esw_array = new Array();

    var asw_toSend = JSON.parse(JSON.stringify( schedule_days ));
    //   console.log(asw_toSend)
    for(var j = 0 ; j < asw_toSend.length ; j++){
      if(asw_toSend[j].time_in != undefined) {
        asw_toSend[j].time_in = asw_toSend[j].time_in.toLocaleString("en-US", { hour12: false });
      }
      if(asw_toSend[j].time_out != undefined)
        asw_toSend[j].time_out = asw_toSend[j].time_out.toLocaleString("en-US", { hour12: false });
      asw_toSend[j].category_name = category_name;
    }

    var schedule_to_send = JSON.stringify(asw_toSend);
    console.log("salvando")
    console.log(schedule_to_send);
    this.schedulerService.updateOrAdd(this.yearQuarter.year,this.selectedWeekItem,schedule_to_send,employee_id)
        .subscribe(
            response=> {
              // this.loading = false;
              console.log(response)
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
    // console.log('-------------')
    // console.log(schedules_added)
    // console.log(employee_id)
    // console.log('-------------')
    for (let i = 0 ; i < this.employeesScheduleList.length ; i++){
      if(this.employeesScheduleList[i].employee_id == employee_id){
        for(let j = 0 ; j < schedules_added.length ; j++){
          console.log(this.employeesScheduleList[i]);
          console.log(this.employeesScheduleList[i].schedule_days)
          let found = this.employeesScheduleList[i].schedule_days.find(e => e.day_of_week == schedules_added[j].day_of_week)
          console.log(found)
          if(found){
            found.id = schedules_added[j].id;
          }
        }
      }
    }
    console.log(this.employeesScheduleList)
  }
}
