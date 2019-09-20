import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {CompanyService} from '../_services/company.service'

@Component({
  /*selector: 'app-register-general-data',*/
  templateUrl: './register-general-data.component.html',
  styleUrls: ['./register-general-data.component.less']
})
export class RegisterGeneralDataComponent implements OnInit {

  SignUpForm: FormGroup;
  returnUrl: string;
  submitted = false;
  loading : boolean = false;
  error_bool:boolean = false;
  error_msg:string;
  private data: any;
  

  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private companyService:CompanyService) { }

  get formField() { return this.SignUpForm.controls; }

  ngOnInit() {
    this.SignUpForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      name: ['', Validators.required],
      confirm_password:['']
    },
    {validator: this.checkPassword});

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  checkPassword(group: FormGroup)
  {
    let password = group.get('password').value;
    let confirm_password = group.get('confirm_password').value;

    return password === confirm_password ? null : {notSame: true}
  }

  get f() { return this.SignUpForm.controls; }


  next(){

    this.loading = true;

    this.submitted = true;

    if (this.SignUpForm.invalid) {
      this.loading = false;
      return;
    }

    //this.loading = true;

    this.data = {
      'email':this.formField.email.value,
    };
    
    this.companyService.existUser(this.data)
    .subscribe((data: any) =>{
      console.log(data);
      if(data.error)
      {
        this.error_bool = true
        this.loading = false;
        this.error_msg = data.error;
      }
      else{
        this.router.navigate(['register-plan-data', { name: this.formField.name.value, password: this.formField.password.value, email: this.formField.email.value }  ]);
      }
    },
    error => {
        console.log(error);
        this.loading = false;
        this.error_bool = true
        this.error_msg = error;
    });

    return;

    
  }

}
