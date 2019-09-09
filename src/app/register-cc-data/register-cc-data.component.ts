import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {CompanyService} from '../_services/company.service'
import {Observable, throwError} from 'rxjs';
import {retry, catchError} from 'rxjs/operators';
import {NgbDateStruct, NgbCalendar} from '@ng-bootstrap/ng-bootstrap' 

@Component({
  selector: 'app-register-cc-data',
  templateUrl: './register-cc-data.component.html',
  styleUrls: ['./register-cc-data.component.less']
})
export class RegisterCcDataComponent implements OnInit {

  SignUpForm: FormGroup;
  returnUrl: string;
  submitted = false;
  private sub: any;
  private name: string;
  private email: string;
  private password: string;
  private id_plans: string;
  private data: any;
  cc_expired_date: NgbDateStruct;
  cc_expired_date_error : boolean = false;
  loading : boolean = false;
  
  constructor(private calendar: NgbCalendar,private formBuilder: FormBuilder, private companyService:CompanyService,private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {

    this.cc_expired_date = this.calendar.getToday();

    this.SignUpForm = this.formBuilder.group({
      cc: ['', [Validators.required,Validators.maxLength(4)]],
      ba_street : ['', Validators.required],
      ba_street2 : ['', Validators.required],
      ba_city : ['', Validators.required],
      ba_state : ['', Validators.required],
      ba_zip_code : ['', [Validators.required,,Validators.maxLength(5)]],
      card_holder_name : ['', Validators.required],
    });

    this.sub = this.route.params.subscribe(params=>{
      this.name = params.name;
      this.password = params.password;
      this.email = params.email;
      this.id_plans = params.id_plans;
      
    });
  }

  get formField() { return this.SignUpForm.controls; }

  get f() { return this.SignUpForm.controls; }

  next(){

    this.submitted = true;

    if (this.SignUpForm.invalid) {
      //console.log('adad');
      return;
    }

    //console.log(`${this.cc_expired_date.year}-${this.cc_expired_date.month}-${this.cc_expired_date.day}`);
    //return;

    console.log(this.formField.card_holder_name);
      this.data = {
       'name':this.name,
       'email':this.email, 
       'password':this.password,
       'cc': this.formField.cc.value,
       'cc_expired_date': `${this.cc_expired_date.year}-${this.cc_expired_date.month}-${this.cc_expired_date.day}`,
       'ba_street': this.formField.ba_street.value,
       'ba_street2': this.formField.ba_street2.value,
       'ba_city': this.formField.ba_city.value,
       'ba_state': this.formField.ba_state.value,
       'ba_zip_code': this.formField.ba_zip_code.value,
       'card_holder_name': this.formField.card_holder_name.value,
       'plans':this.id_plans.split(',')
    };
    this.loading = true;
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
