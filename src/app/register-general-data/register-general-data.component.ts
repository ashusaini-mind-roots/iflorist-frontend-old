import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  /*selector: 'app-register-general-data',*/
  templateUrl: './register-general-data.component.html',
  styleUrls: ['./register-general-data.component.less']
})
export class RegisterGeneralDataComponent implements OnInit {

  SignUpForm: FormGroup;
  returnUrl: string;
  submitted = false;

  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute,) { }

  get formField() { return this.SignUpForm.controls; }

  ngOnInit() {
    this.SignUpForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      name: ['', Validators.required]
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  get f() { return this.SignUpForm.controls; }


  next(){

    this.submitted = true;

    if (this.SignUpForm.invalid) {
      return;
    }

    this.router.navigate(['register-plan-data', { name: this.formField.name.value, password: this.formField.password.value, email: this.formField.email.value }  ])
  }

}
