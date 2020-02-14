import { Component, OnInit } from '@angular/core';
import { StoreSubscriberService } from "../../_services/storeSubscriber.service";
import { UtilsService } from "../../_services/utils.service";
import { EmployeeService } from "../../_services/employee.service";
import {ConfirmationService} from 'primeng/api';
import { MessageToastService } from '../../_services/messageToast.service';
import { CheckRole } from "../../_helpers/check-role";

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.less'],
  providers: [ConfirmationService]
})
export class EmployeeListComponent implements OnInit {
  selectedStorage: any;
  employees: any[];
  cols: any[];

  constructor(
      private storeSubscriberService: StoreSubscriberService,//service used to receive store from top bar stores combobox
      private utilService: UtilsService,
      private employeeService: EmployeeService,
	  private confirmationService: ConfirmationService,
	  private message: MessageToastService,
	  private checkRole: CheckRole,
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
	  { field: 'name', header: 'Store Admin' }, 
      { field: 'name', header: 'Name' },
      { field: 'email', header: 'Email Address' },
      { field: 'category', header: 'Category' },
      { field: 'phone', header: 'Phone Number' },
      { field: 'status_name', header: 'Position' },
      { field: 'store', header: 'Store' },
	  { field: 'active', header: 'Active' },
      { field: 'actions', header: 'Actions' },
    ];
  }
  
  storeAdminChange(employee_id)
  {
	  console.log(employee_id);
	  this.confirmChangeStoreAdmin(employee_id);
  }
  
  confirmChangeStoreAdmin(employee_id) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to change the Store Administrator ?',
      accept: () => {
        this.employeeService.changeAdminStore(employee_id,this.selectedStorage.id).subscribe((response: any) =>{
          if(response.error)
			this.message.sendMessage('error', 'Employee Message', response.error);
	      else
		  {
			this.message.sendMessage('success','Employee Message','Store Admin was changed !');  
		  }
		  this.getEmployees();
		},
		error => {
          console.log(error)
          //this.error = error;
          //this.loading = false;
          this.message.sendMessage('error', 'Employee Message', 'Store Admin change failed !');
		  this.getEmployees();
        });
      },
	  reject:()=>{
		  this.getEmployees();
	  }
    });
  }
  
  get hasAcces() {
        if(this.checkRole.isRoot() || this.checkRole.isCompanyAdmin())
		  return true;
		else return false;
	}
}
