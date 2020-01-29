import {Component, Input, OnInit} from '@angular/core';
import { SchedulerService } from "../../_services/scheduler.service";
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
  employeesList: any[];
  employeesListSelected: any;

  constructor(
      private schedulerService: SchedulerService,
      private storeSubscriberService: StoreSubscriberService,//service used to receive store from top bar stores combobox
  ) {
    storeSubscriberService.subscribe(this,function (ref,store) {
      ref.receiveStorage(store);
    });
  }

  ngOnInit() {
    this.getCategoriesEmployees();
  }

  ngOnChanges(changes){
    console.log("week:" + this.selectedWeekItem)
    if(this.selectedStorage && this.selectedWeekItem ){
      console.log(this.selectedStorage);
      console.log(this.yearQuarter);
      // this.getScheduleInformation();
    }
  }

  onCategorySelected(event: any){
    console.log("pingaaaaaaaa: ")
    console.log(event.target.value);
   // this.employeesListSelected  = [];
    // var foundStore = this.stores.filter(obj=>obj.id == value);
    this.populateEmployeesCombo(event.target.value);
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
        this.categoriesEmployeesListSelectedItem = this.categoriesEmployeesList[0].id;
        this.populateEmployeesCombo(this.categoriesEmployeesListSelectedItem);
        this.employeesListSelected = this.categoriesEmployeesList[0].employees[0].id;
        console.log(this.categoriesEmployeesListSelectedItem)
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
}
