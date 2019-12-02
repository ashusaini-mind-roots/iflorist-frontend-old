import { Component, OnInit } from '@angular/core';
import { StoreSubscriberService } from "../../_services/storeSubscriber.service";
import { UtilsService } from "../../_services/utils.service";
import { EmployeeService } from "../../_services/employee.service";

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.less']
})
export class EmployeeListComponent implements OnInit {
  selectedStorage: any;
  employees: any[];
  cols: any[];

  constructor(
      private storeSubscriberService: StoreSubscriberService,//service used to receive store from top bar stores combobox
      private utilService: UtilsService,
      private employeeService: EmployeeService,
  ) {
    storeSubscriberService.subscribe(this,function (ref,store) {
      ref.receiveStorage(store);
    });
  }

  ngOnInit() {
    this.loadHeaders();
    this.selectedStorage = JSON.parse(localStorage.getItem('selectedStorage'));
    this.getEmployees();

  }
  receiveStorage(storage){
    this.selectedStorage = storage;
    console.log(storage.id)
    this.getEmployees();
  }
  getEmployees()
  {
    this.employeeService.getEmployees(this.selectedStorage.id).subscribe((response: any) =>{
      this.employees = response.employees;
      console.log(this.employees);
    });
  }

  loadHeaders(){
    this.cols = [
      { field: 'name', header: 'Name' },
      { field: 'email', header: 'Email Address' },
      { field: 'category', header: 'Category' },
      { field: 'phone', header: 'Phone Number' },
      { field: 'status_name', header: 'Position' },
      { field: 'store', header: 'Store' },
      { field: 'actions', header: 'Actions' },
    ];
  }
}
