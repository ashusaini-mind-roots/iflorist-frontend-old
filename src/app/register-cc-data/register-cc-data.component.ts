import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CompanyService} from '../_services/company.service';
import {Observable, throwError} from 'rxjs';
import {retry, catchError} from 'rxjs/operators';
import {NgbDateStruct, NgbCalendar} from '@ng-bootstrap/ng-bootstrap' ;
import {UtilsService} from '../_services/utils.service';
import {RouterService} from '../_services/router.service';

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
  private stripe: any;
  private cardNumber: any;

  constructor(
    private calendar: NgbCalendar,
    private formBuilder: FormBuilder,
    private companyService: CompanyService,
    private route: ActivatedRoute,
    private router: Router,
    private utils: UtilsService,
    private routerService: RouterService
  ) {
    this.stripe = Stripe('pk_test_EIdZt3Y9gtHvtNEnRcRxcDWl');

  }

  ngOnInit() {
    document.body.classList.add('bg-login-img');
    this.createSignUpForm();
    // https://stripe.com/docs/stripe-js/reference#elements-create
    const elements = this.stripe.elements({
      fonts: [
        {
          cssSrc: 'https://fonts.googleapis.com/css?family=Source+Code+Pro',
        },
      ],
    });
    this.floatingLabels();


    const elementStyles = {
      base: {
         color: '#8996A3',
        // fontWeight: 500,
        // //fontFamily: 'Source Code Pro, Consolas, Menlo, monospace',
        fontSize: '12px',
        // fontSmoothing: 'antialiased',

        '::placeholder': {
          color: '#D5DCE3',
        },
        // ':-webkit-autofill': {
        //   color: '#e39f48',
        // },
      },
      invalid: {
        color: '#E25950',

        '::placeholder': {
          color: '#FFCCA5',
        },
      },
    };
    const expirationElementStyles = {
      base: {
        color: '#8996A3',
        // fontWeight: 500,
        // //fontFamily: 'Source Code Pro, Consolas, Menlo, monospace',
        fontSize: '12px',
        // fontSmoothing: 'antialiased',

        '::placeholder': {
          color: '#999999',
        },
        // ':-webkit-autofill': {
        //   color: '#e39f48',
        // },
      },
      invalid: {
        color: '#E25950',

        '::placeholder': {
          color: '#FFCCA5',
        },
      },
    };
    // const elementClasses = {
    //   focus: 'focused',
    //   empty: 'empty',
    //   invalid: 'invalid',
    // };
    this.cardNumber = elements.create('cardNumber', {
      style: elementStyles,
      // classes: elementClasses,
    });

    this.cardNumber.mount('#example2-card-number');
    this.validate(this.cardNumber);

    const cardExpiry = elements.create('cardExpiry', {
      style: expirationElementStyles,
      // classes: elementClasses,
    });
    cardExpiry.mount('#example2-card-expiry');
    this.validate(cardExpiry);
    this.cc_expired_date = cardExpiry;

    const cardCvc = elements.create('cardCvc', {
      style: elementStyles,
      // classes: elementClasses,
    });
    cardCvc.mount('#example2-card-cvc');
    this.validate(cardCvc);
    // card.mount('#card-element');


    // Listen for form submission, process the form with Stripe,
    // and get the
   // const paymentForm = document.getElementById('payment-form');
    //--------------------------------------

  }

  onSubmit() {
    this.submitted = true;
   // const displayError = document.getElementById('card-errors');
    if (this.SignUpForm.invalid) {
      this.error_msg = 'Form fields are invalid';
     // displayError.textContent = 'Form fields are invalid';
      return false;
    } else {
      this.error_msg = '';
     // displayError.textContent = '';
     // const paymentForm = document.getElementById('payment-form');
      // Gather additional customer data we may have collected in our form.

      event.preventDefault();
      const additionalData = this.getFormData();

      additionalData.stripe_token = "pepetokensoloparalocal";
      this.saveCompanyData(additionalData);
      //codigo funcionando correctamente, descomentariar para subir al repo
      // this.stripe.createToken(this.cardNumber, additionalData)
      //   .then((result) => {
      //     console.log(result)
      //     if (result.token) {
      //       additionalData.stripe_token = result.token.id;
      //       // console.log(['onSubmit', additionalData]);
      //      // this.saveCompanyData(additionalData);
      //       // If we received a token, show the token ID.
      //       // console.log(result.token.id);
      //     } else {
      //       displayError.textContent = 'No token';
      //     }
      //   });
    }
  }

//   next() {
// console.log('next');
//     // this.submitted = true;
//     //
//     // if (this.SignUpForm.invalid) {
//     //   //console.log('adad');
//     //   return;
//     // }
//     //
//     // this.data = {
//     //   'card_number': this.formField.card_number.value,
//     //   'cc': this.formField.cc.value,
//     //   'card_holder_name': this.formField.card_holder_name.value,
//     //   'ba_zip_code': this.formField.ba_zip_code.value,
//     // };
//
//     this.companyService.validateCard(this.data)
//       .subscribe((data: any) => {
//
//           if (data.error == false) {
//             this.error_bool = true
//             this.loading = false;
//             this.error_msg = data.msg;
//           } else {
//             this.data = {
//               // 'name': this.name,
//               // 'email': this.email,
//               // 'password': this.password,
//               // 'cc': this.formField.cc.value,
//               // 'card_number': this.formField.card_number.value,
//               // 'cc_expired_date': `${this.formField.cc_year.value}-${this.formField.cc_moth.value}-01}`,
//               // 'ba_street': this.formField.ba_street.value,
//               // 'ba_street2': this.formField.ba_street2.value,
//               // 'ba_city': this.formField.ba_city.value,
//               // 'ba_state': this.formField.ba_state.value,
//               // 'ba_zip_code': this.formField.ba_zip_code.value,
//               // 'card_holder_name': this.formField.card_holder_name.value,
//               // 'plans': this.id_plans.split(',')
//             };
//             this.loading = true;
//             this.companyService.create(this.data)
//               .subscribe((data: any) => {
//                   //console.log(data.plans);
//                   this.router.navigate(['home'])
//                 },
//                 error => {
//                   console.log(error)
//                 });
//           }
//         },
//         error => {
//           console.log(error);
//           this.loading = false;
//           this.error_bool = true
//           this.error_msg = error;
//         });
//     console.log(this.error_bool);
//     //return;
//     //console.log(`${this.cc_expired_date.year}-${this.cc_expired_date.month}-${this.cc_expired_date.day}`);
//   }

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

  createSignUpForm() {
    this.SignUpForm = this.formBuilder.group({
      // cc: ['', [Validators.required, Validators.maxLength(4)]],
      // cc_year: ['2019', [Validators.required]],
      // cc_moth: ['', [Validators.required]],
      ba_street: ['', Validators.required],
      ba_street2: ['', ],
      ba_city: ['', Validators.required],
      ba_state: ['', Validators.required],
      ba_zip_code: ['', [Validators.required, Validators.maxLength(5), Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      card_holder_name: ['', Validators.required],
    });

    /*this.sub = this.route.params.subscribe(params => {
      this.name = params.name;
      this.password = params.password;
      this.email = params.email;
      this.id_plans = params.id_plans;
    });*/
    if(this.routerService.getRouterData()!=undefined)
    {
        console.log(this.routerService.getRouterData());
        this.name = this.routerService.getRouterData()[0]['name'];
        this.password = this.routerService.getRouterData()[0]['password'];
        this.email = this.routerService.getRouterData()[0]['email'];
        this.id_plans = this.routerService.getRouterData()[0]['id_plans'];
    }
  }

  floatingLabels() {
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
  }

  // used for showing validations on html file
  get f() { return this.SignUpForm.controls; }

  getFormData() {
    const additionalData = {
      name: this.SignUpForm.value.card_holder_name || undefined,
      address_line1: this.SignUpForm.value.ba_street || undefined,
      address_line2: this.SignUpForm.value.ba_street2 || undefined,
      address_city: this.SignUpForm.value.ba_city || undefined,
      address_state: this.SignUpForm.value.ba_state || undefined,
      address_zip: this.SignUpForm.value.ba_zip_code || undefined,
      stripe_token: undefined
    };
    return additionalData;
  }

  saveCompanyData(formData) {
    this.loading = true;
    // console.log(['formData', formData]);
    if(this.routerService.getRouterData()==undefined)
    {
      return;
    }
    this.data = {
      card_token: formData.stripe_token,
      name: formData.name,
      email: this.email,
      password: this.password,
      ba_street: formData.address_line1,
      ba_street2: formData.address_line2,
      ba_city: formData.address_city,
      ba_state: formData.address_state,
      ba_zip_code: formData.address_zip,
      card_holder_name: formData.name,
      company_nane: this.name,

      plans: this.id_plans,
    };

    // console.log(this.data);
    this.companyService.create(this.data)
      .subscribe((data: any) => {
      console.log(this.data);
          // console.log(data.plans);
         // this.router.navigate(['home']);
            this.routerService.setRouterData(undefined);
            this.router.navigate(['check-email-message', { email: this.data.email }]);
            this.loading = false;
        },
        error => {
          this.loading = false;
          this.error_bool = true;
          this.error_msg = error;
        }
      );

  }
}
