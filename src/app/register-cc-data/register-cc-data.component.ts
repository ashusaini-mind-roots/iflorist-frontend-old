import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CompanyService} from '../_services/company.service'
import {Observable, throwError} from 'rxjs';
import {retry, catchError} from 'rxjs/operators';
import {NgbDateStruct, NgbCalendar} from '@ng-bootstrap/ng-bootstrap' ;
import {UtilsService} from '../_services/utils.service'

declare var Stripe: any;

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
  cc_expired_date_error: boolean = false;
  loading: boolean = false;
  error_bool: boolean = false;
  error_form: boolean = false;
  error_msg: string;
  //stores: Storage[] = [];
  years_range: any[] = [];


  constructor(
    private calendar: NgbCalendar,
    private formBuilder: FormBuilder,
    private companyService: CompanyService,
    private route: ActivatedRoute,
    private router: Router,
    private utils: UtilsService
  ) {
  }

  ngOnInit() {
    // https://stripe.com/docs/stripe-js/reference#elements-create
    const stripe = Stripe('pk_test_EIdZt3Y9gtHvtNEnRcRxcDWl');

    const elements = stripe.elements({
      fonts: [
        {
          cssSrc: 'https://fonts.googleapis.com/css?family=Source+Code+Pro',
        },
      ],
    });

    // Floating labels
    const inputs = document.querySelectorAll('.cell.example.example2 .input');
    Array.prototype.forEach.call(inputs, function (input) {
      input.addEventListener('focus', function () {
        input.classList.add('focused');
      });
      input.addEventListener('blur', function () {
        input.classList.remove('focused');
      });
      input.addEventListener('keyup', function () {
        if (input.value.length === 0) {
          input.classList.add('empty');
        } else {
          input.classList.remove('empty');
        }
      });
    });

    const elementStyles = {
      base: {
        color: '#32325D',
        fontWeight: 500,
        fontFamily: 'Source Code Pro, Consolas, Menlo, monospace',
        fontSize: '16px',
        fontSmoothing: 'antialiased',

        '::placeholder': {
          color: '#CFD7DF',
        },
        ':-webkit-autofill': {
          color: '#e39f48',
        },
      },
      invalid: {
        color: '#E25950',

        '::placeholder': {
          color: '#FFCCA5',
        },
      },
    };

    var elementClasses = {
      focus: 'focused',
      empty: 'empty',
      invalid: 'invalid',
    };
    const cardNumber = elements.create('cardNumber', {
      style: elementStyles,
      classes: elementClasses,
    });
    cardNumber.mount('#example2-card-number');
    this.validate(cardNumber);

    const cardExpiry = elements.create('cardExpiry', {
      style: elementStyles,
      classes: elementClasses,
    });
    cardExpiry.mount('#example2-card-expiry');
    this.validate(cardExpiry);

    var cardCvc = elements.create('cardCvc', {
      style: elementStyles,
      classes: elementClasses,
    });
    cardCvc.mount('#example2-card-cvc');
    this.validate(cardCvc);
    // card.mount('#card-element');


    // Listen for form submission, process the form with Stripe,
    // and get the
    const paymentForm = document.getElementById('payment-form');

    // paymentForm.addEventListener('submit', event => {
    //   event.preventDefault();
    //   return console.log('submit');
    //   stripe.createToken(cardNumber).then(result => {
    //     if (result.error) {
    //       console.log('Error creating payment method.');
    //       const errorElement = document.getElementById('card-errors');
    //       errorElement.textContent = result.error.message;
    //     } else {
    //
    //       // At this point, you should send the token ID
    //       // to your server so it can attach
    //       // the payment source to a customer
    //       console.log('Token acquired!');
    //       console.log(result.token);
    //       console.log(result.token.id);
    //     }
    //   });
    // });

    //--------------------------------------
    this.years_range = this.yearsRange;
    this.cc_expired_date = this.calendar.getToday();

    this.SignUpForm = this.formBuilder.group({

      cc: ['', [Validators.required, Validators.maxLength(4)]],
      cc_year: ['2019', [Validators.required]],
      cc_moth: ['', [Validators.required]],
      ba_street: ['', Validators.required],
      ba_street2: [],
      ba_city: ['', Validators.required],
      ba_state: ['', Validators.required],
      ba_zip_code: ['', [
        Validators.required,
        Validators.maxLength(5),
        Validators.pattern(/^-?(0|[1-9]\d*)?$/)
      ]],
      card_holder_name: ['', Validators.required],
      card_number: ['', [
        Validators.required,
        Validators.maxLength(16),
        Validators.minLength(16),
        Validators.pattern(/^-?(0|[1-9]\d*)?$/)
      ]],
    });

    this.sub = this.route.params.subscribe(params => {
      this.name = params.name;
      this.password = params.password;
      this.email = params.email;
      this.id_plans = params.id_plans;

    });
  }

  get yearsRange() {
    var current_year = this.utils.GetCurrentYear();
    return this.utils.GetYears(current_year, current_year + 10);
  }

  get formField() {
    return this.SignUpForm.controls;
  }

  next() {

    this.submitted = true;

    if (this.SignUpForm.invalid) {
      //console.log('adad');
      return;
    }

    this.data = {
      'card_number': this.formField.card_number.value,
      'cc': this.formField.cc.value,
      'card_holder_name': this.formField.card_holder_name.value,
      'ba_zip_code': this.formField.ba_zip_code.value,
    };

    this.companyService.validateCard(this.data)
      .subscribe((data: any) => {
          console.log(data);
          if (data.error == false) {
            this.error_bool = true
            this.loading = false;
            this.error_msg = data.msg;
          } else {
            this.data = {
              'name': this.name,
              'email': this.email,
              'password': this.password,
              'cc': this.formField.cc.value,
              'card_number': this.formField.card_number.value,
              'cc_expired_date': `${this.formField.cc_year.value}-${this.formField.cc_moth.value}-01}`,
              'ba_street': this.formField.ba_street.value,
              'ba_street2': this.formField.ba_street2.value,
              'ba_city': this.formField.ba_city.value,
              'ba_state': this.formField.ba_state.value,
              'ba_zip_code': this.formField.ba_zip_code.value,
              'card_holder_name': this.formField.card_holder_name.value,
              'plans': this.id_plans.split(',')
            };
            this.loading = true;
            this.companyService.create(this.data)
              .subscribe((data: any) => {
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

  validate(element) {
    element.addEventListener('change', event => {
      const displayError = document.getElementById('card-errors');
      if (event.error) {
        displayError.textContent = event.error.message;
      } else {
        displayError.textContent = '';
      }
    });
  }

  enableInputs() {
    Array.prototype.forEach.call(
      form.querySelectorAll(
        "input[type='text'], input[type='email'], input[type='tel']"
      ),
      function(input) {
        input.removeAttribute('disabled');
      }
    );
  }

  disableInputs() {
    Array.prototype.forEach.call(
      form.querySelectorAll(
        "input[type='text'], input[type='email'], input[type='tel']"
      ),
      function(input) {
        input.setAttribute('disabled', 'true');
      }
    );
  }
}
