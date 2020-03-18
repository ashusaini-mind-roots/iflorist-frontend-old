import { Component, OnInit } from '@angular/core';
import { CompanyemployeeService } from "../../_services/companyemployee.service";
import { UserService, AuthenticationService } from '@app/_services';
import { MessageService } from "../../_services/message.service";
import { environment } from '@environments/environment';

@Component({
  selector: 'app-companyemployee-list',
  templateUrl: './companyemployee-list.component.html',
  styleUrls: ['./companyemployee-list.component.less']
})
export class CompanyemployeeListComponent implements OnInit {
  employees: any[];
  cols: any[];
  displayList: boolean = true;
  employeesDefault: any[];
  urlImage: string = environment.apiUrl+'/companyemployee/show_imagen/';

  constructor(
      private userService: UserService,
      private authenticationService: AuthenticationService,
      private companyEmployeeService: CompanyemployeeService,
	  private messageService: MessageService,
  ) { }

  ngOnInit() {
    this.loadHeaders();
    this.getEmployees();
	
	this.messageService.getChangeDisplayModeData().subscribe(message => {
		this.displayList = message;
	});
	
	this.messageService.getFilterText().subscribe(message => {
		this.employees = this.employeesDefault;
		if(message)
		{
			let temp = [];
			this.employees.forEach(obj=>{
				if(obj.name.includes(message) || obj.email.includes(message)  || obj.phone_number.includes(message) || obj.status_name.includes(message))
				{
					temp.push(obj);
				}
			});
			this.employees = temp;
		}
	});
  }

  getEmployees()
  {
    this.companyEmployeeService.getCompanyEmployees(this.authenticationService.currentUserValue.company.id).subscribe((response: any) =>{
      this.employees = response.employees;
	  this.employeesDefault = this.employees;
    });
  }

  loadHeaders(){
    this.cols = [
      { field: 'company', header: 'Company' },
      { field: 'name', header: 'Name' },
      { field: 'email', header: 'Email Address' },
      { field: 'phone', header: 'Phone Number' },
      { field: 'status_name', header: 'Position' },
	  { field: 'active', header: 'Active' },
      { field: 'actions', header: 'Actions' },
    ];
  }
}
