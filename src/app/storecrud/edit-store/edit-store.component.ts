import { Observable } from "rxjs";
import { StoreService } from "../../_services/store.service";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-edit-store',
  templateUrl: './edit-store.component.html',
  styleUrls: ['./edit-store.component.less']
})
export class EditStoreComponent implements OnInit {
  storeEditform: FormGroup;
  store: any = {};
  submitted = false;
  // returnUrl: string;
  error = '';
  success = '';
  loading = false;

  constructor(
      private formBuilder: FormBuilder,
      private route: ActivatedRoute,
      private router: Router,
      private storeService: StoreService
  ) { }

  // convenience getter for easy access to form fields
  get f() { return this.storeEditform.controls; }

  ngOnInit() {
    this.storeEditform = this.formBuilder.group({
      store_name: ['', Validators.required],
      contact_email: ['',  Validators.email],
      contact_phone: [''],
      zip_code: ['', [Validators.minLength(5),Validators.maxLength(6)]],
      address: ['']
    });
    //console.log("pepitotey");
    this.route.params.subscribe(params => {
      this.storeService.getStore(params['id']).subscribe(res => {
        this.store = res.store;
        console.log(params['id']);
      });
    });
  }

  editStore(){
    this.submitted = true;
    if (this.storeEditform.invalid) {
      this.loading = false;
      return;
    }
    this.error = '';
    this.success = '';
    this.loading = true;
    this.route.params.subscribe(params => {
      console.log("pepe"+params['id'])

      this.storeService.updateStore(params['id'],this.f.store_name.value,this.f.contact_email.value,
          this.f.contact_phone.value,this.f.zip_code.value,this.f.address.value).subscribe(
              response=> {
                this.loading = false;
                this.success = 'Store updated succefull !';
               // console.log(response)
              },
              error => {
                console.log(error)
                this.error = error;
                this.loading = false;
              }
          );
    });
  }

}
