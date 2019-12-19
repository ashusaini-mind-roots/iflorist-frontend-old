import { Component, OnInit } from '@angular/core';
import { CompanyemployeeService } from "../../_services/companyemployee.service";
import { UserService, AuthenticationService } from '@app/_services';

@Component({
  selector: 'app-companyemployee-list',
  templateUrl: './companyemployee-list.component.html',
  styleUrls: ['./companyemployee-list.component.less']
})
export class CompanyemployeeListComponent implements OnInit {
  employees: any[];
  cols: any[];

  constructor(
      private userService: UserService,
      private authenticationService: AuthenticationService,
      private companyEmployeeService: CompanyemployeeService,
  ) { }

  ngOnInit() {
    this.loadHeaders();
    this.getEmployees();
  }

  getEmployees()
  {
    console.log(this.authenticationService.currentUserValue.company.id);
    this.companyEmployeeService.getCompanyEmployees(this.authenticationService.currentUserValue.company.id).subscribe((response: any) =>{
      this.employees = response.employees;
      console.log("companyEmployees: ");
      console.log(this.employees);
    });
  }

  loadHeaders(){
    this.cols = [
      { field: 'name', header: 'Name' },
      { field: 'actions', header: 'Actions' },
    ];
  }
}
