import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  /*selector: 'app-register-general-data',*/
  templateUrl: './register-general-data.component.html',
  styleUrls: ['./register-general-data.component.less']
})
export class RegisterGeneralDataComponent implements OnInit {

  SignUpForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private router: Router) { }

  get formField() { return this.SignUpForm.controls; }

  ngOnInit() {
    this.SignUpForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      name: ['', Validators.required]
    });
  }

  next(){
    this.router.navigate(['register-plan-data', { name: this.formField.name.value, password: this.formField.password.value, email: this.formField.email.value }  ])
  }

}
