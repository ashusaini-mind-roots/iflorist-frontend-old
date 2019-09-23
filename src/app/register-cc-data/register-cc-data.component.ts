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
  error_bool:boolean = false;
  error_form:boolean = false;
  error_msg:string;


  constructor(private calendar: NgbCalendar,private formBuilder: FormBuilder, private companyService:CompanyService,private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {

    this.cc_expired_date = this.calendar.getToday();

    this.SignUpForm = this.formBuilder.group({
      cc: ['', [Validators.required,Validators.maxLength(4)]],
      cc_year: ['2019', [Validators.required]],
      cc_moth: ['', [Validators.required]],
      ba_street : ['', Validators.required],
      ba_street2 : ['', Validators.required],
      ba_city : ['', Validators.required],
      ba_state : ['', Validators.required],
      ba_zip_code : ['', [Validators.required,Validators.maxLength(5),Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      card_holder_name : ['', Validators.required],
      card_number : ['', [Validators.required,Validators.maxLength(16),Validators.minLength(16),Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
    });

    this.sub = this.route.params.subscribe(params=>{
      this.name = params.name;
      this.password = params.password;
      this.email = params.email;
      this.id_plans = params.id_plans;

    });
  }

  get formField() { return this.SignUpForm.controls; }

  next(){

    this.submitted = true;

    if (this.SignUpForm.invalid) {
      //console.log('adad');
      return;
    }

    this.data = {
      'card_number':this.formField.card_number.value,
      'cc':this.formField.cc.value,
      'card_holder_name':this.formField.card_holder_name.value,
      'ba_zip_code':this.formField.ba_zip_code.value,
    };

    this.companyService.validateCard(this.data)
    .subscribe((data: any) =>{
      console.log(data);
      if(data.error==false)
      {
        this.error_bool = true
        this.loading = false;
        this.error_msg = data.msg;
      }
      else
      {
        this.data = {
          'name':this.name,
          'email':this.email,
          'password':this.password,
          'cc': this.formField.cc.value,
          'card_number':this.formField.card_number.value,
          'cc_expired_date': `${this.formField.cc_year.value}-${this.formField.cc_moth.value}-01}`,
          'ba_street': this.formField.ba_street.value,
          'ba_street2': this.formField.ba_street2.value,
          'ba_city': this.formField.ba_city.value,
          'ba_state': this.formField.ba_state.value,
          'ba_zip_code': this.formField.ba_zip_code.value,
          'card_holder_name': this.formField.card_holder_name.value,
          'plans':this.id_plans.split(',')
        };
        this.loading = true;
        this.companyService.create(this.data)
        .subscribe((data: any) =>{
          //console.log(data.plans);
          this.router.navigate(['home'])
        },
        error => {
          console.log(error)
        });
      }
    },
    error => {
        console.log(error);
        this.loading = false;
        this.error_bool = true
        this.error_msg = error;
    });
    console.log(this.error_bool);
    //return;
    //console.log(`${this.cc_expired_date.year}-${this.cc_expired_date.month}-${this.cc_expired_date.day}`);
  }

}
