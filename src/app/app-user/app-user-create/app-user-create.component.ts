import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppUserService } from "../../_services/appUser.service";
import { StoreService } from '../../_services/store.service';
import { MessageToastService } from '../../_services/messageToast.service';
import { StoreSubscriberService } from "../../_services/storeSubscriber.service";

@Component({
  selector: 'app-app-user-create',
  templateUrl: './app-user-create.component.html',
  styleUrls: ['./app-user-create.component.less']
})
export class AppUserCreateComponent implements OnInit {
	
  stores: any[];
  appUserform: FormGroup;
  submitted = false;
  loading = false;
  error: string = '';
  selectedStorage: any;
  

  constructor(
    private storeService: StoreService,
    private formBuilder: FormBuilder,
    private appUserService: AppUserService,
    private message: MessageToastService,
    private storeSubscriberService: StoreSubscriberService) {
		/*storeSubscriberService.subscribe(this,function (ref,store) {
		  ref.receiveStorage(store);
		});*/
	}

  ngOnInit() {
	  this.selectedStorage = JSON.parse(localStorage.getItem('selectedStorage'));
    //this.selectedStorage.id = 1;
      this.appUserform = this.formBuilder.group({
      name: ['', Validators.required],
      store: ['', Validators.required],
      email: ['',[Validators.required, Validators.email]],
      active: ['1'],
    });
	this.getStoreList();
  }
  
  getStoreList() {
    this.storeService.getStoreList().subscribe((data: any) => {
      this.stores = data.stores;
    });
  }
  
  get f() { return this.appUserform.controls; }
  
  onSubmit() {
    this.submitted = true;
    this.error = '';
    // stop here if form is invalid
    if (this.appUserform.invalid) {
      //this.loading = false;
      return;
    }
    this.loading = true;
    this.appUserService.createAppUser(this.f.name.value, this.f.email.value  , this.f.store.value, this.f.active.value)
      .pipe()
      .subscribe(
        (data: any) => {
          this.loading = false;

          if (data.error) {
            this.message.sendMessage('error', 'App User Message', data.error);
            this.error = data.error;
          }
          else {
            this.clean();
            this.message.sendMessage('success', 'App User Message', 'App User created successfully successfully !');
          }
          //this.success = 'Store added succefull !';
          //this.clean();
          //this.router.navigate([this.returnUrl]);
        },
        error => {
          console.log(error)
          //this.error = error;
          this.loading = false;
          this.message.sendMessage('error', 'App User Message', error);
        });
  }

  clean() {
    this.f.name.setValue('');
    this.f.email.setValue('');
    this.f.active.setValue('1');
    this.submitted = false;
    this.error = '';
    
    //this.onChangeSysteAccount();
  }
  

}
