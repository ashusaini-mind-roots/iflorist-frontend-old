import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {CompanyService} from '../_services/company.service'
import {Observable, throwError} from 'rxjs';
import {retry, catchError} from 'rxjs/operators';

@Component({
  selector: 'app-register-cc-data',
  templateUrl: './register-cc-data.component.html',
  styleUrls: ['./register-cc-data.component.less']
})
export class RegisterCcDataComponent implements OnInit {

  SignUpForm: FormGroup;
  private sub: any;
  private name: string;
  private email: string;
  private password: string;
  private id_plans: string;
  private data: any;
  
  constructor(private formBuilder: FormBuilder, private companyService:CompanyService,private activateRoute: ActivatedRoute, private router: Router) { }

  ngOnInit() {

    this.SignUpForm = this.formBuilder.group({
      cc: ['', Validators.required],
      cc_expired_date: ['', Validators.required],
      ba_street : ['', Validators.required],
      ba_street2 : ['', Validators.required],
      ba_city : ['', Validators.required],
      ba_state : ['', Validators.required],
      ba_zip_code : ['', Validators.required],
      card_holder_name : ['', Validators.required],
    });

    this.sub = this.activateRoute.params.subscribe(params=>{
      this.name = params.name;
      this.password = params.password;
      this.email = params.email;
      this.id_plans = params.id_plans;
      
    });
  }

  get formField() { return this.SignUpForm.controls; }

  next(){
    console.log(this.formField.card_holder_name);
      this.data = {
       'name':this.name,
       'email':this.email, 
       'password':this.password,
       'cc': this.formField.cc.value,
       'cc_expired_date': this.formField.cc_expired_date.value,
       'ba_street': this.formField.ba_street.value,
       'ba_street2': this.formField.ba_street2.value,
       'ba_city': this.formField.ba_city.value,
       'ba_state': this.formField.ba_state.value,
       'ba_zip_code': this.formField.ba_zip_code.value,
       'card_holder_name': this.formField.card_holder_name.value,
       'plans':this.id_plans.split(',')
    };
    return this.companyService.create(this.data)
    .subscribe((data: any) =>{
      console.log(data.plans);
      this.router.navigate(['activate-company'])
  },
  error => {
    console.log(error)
})
  }

}
