import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompanyemployeeService } from "../../_services/companyemployee.service";
import { AuthenticationService } from '@app/_services';
import {MessageToastService} from "@app/_services/messageToast.service";


@Component({
  selector: 'app-create-companyemployee',
  templateUrl: './create-companyemployee.component.html',
  styleUrls: ['./create-companyemployee.component.less']
})
export class CreateCompanyemployeeComponent implements OnInit {
  companyemployeeform: FormGroup;
  loading = false;
  error: string = '';
  submitted = false;

  constructor(
      private companyEmployeeService: CompanyemployeeService,
      private formBuilder: FormBuilder,
      private authenticationService: AuthenticationService,
      private message: MessageToastService,
  ) { }

  ngOnInit() {
    this.companyemployeeform = this.formBuilder.group({
      name: ['', Validators.required],
    });
  }

  get f() { return this.companyemployeeform.controls; }

  onSubmit() {
    this.submitted = true;
    this.error = '';
    if (this.companyemployeeform.invalid) {
      this.loading = false;
      return;
    }
    this.loading = true;

    this.companyEmployeeService.createCompanyemployee(this.f.name.value, this.authenticationService.currentUserValue.company.id)
        .pipe()
        .subscribe(
            (data: any) => {
              console.log(data);
              this.loading = false;

              if (data.error) {
                this.message.sendMessage('error', 'Company Employee Message', data.error);
                this.error = data.error;
              } else {
                this.clean();
                this.message.sendMessage('success', 'Company Employee Message', 'Company Employee created successfully !');
              }
            },
            error => {
              console.log(error)
              this.loading = false;
              this.message.sendMessage('error', 'Company Employee Message', error);
            }
        );
  }
  clean() {
    this.f.name.setValue('');
    this.submitted = false;
    this.error = '';
  }
}
