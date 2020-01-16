import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppUserService } from "../../_services/appUser.service";
import { StoreService } from '../../_services/store.service';
import { MessageToastService } from '../../_services/messageToast.service';
import { StoreSubscriberService } from "../../_services/storeSubscriber.service";
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-app-user-edit',
  templateUrl: './app-user-edit.component.html',
  styleUrls: ['./app-user-edit.component.less']
})
export class AppUserEditComponent implements OnInit {
	
  stores: any[];
  appUserform: FormGroup;
  submitted = false;
  loading = false;
  error: string = '';
  selectedStorage: any;
  appUser: any;
  appUserId: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute, 
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
	
	this.route.params.subscribe(params => {
		this.appUserId = params['id'];
		this.appUserService.getAppUser(params['id']).subscribe(res => {
			this.appUser = res.appUser;
			this.initFormValue(this.appUser);
		});
    });
  }
  
  initFormValue(object: any)
  {
     this.f.name.setValue(object.user.name);
     this.f.active.setValue(object.appUser.activate);
	 this.f.email.setValue(object.user.email);
	 this.f.store.setValue(object.appUser.store_id);
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
    this.appUserService.updateAppUser(this.appUserId,this.f.name.value, this.f.email.value  , this.f.store.value, this.f.active.value)
      .pipe()
      .subscribe(
        (data: any) => {
          console.log(data);
          this.loading = false;

          if (data.error) {
            this.message.sendMessage('error', 'App User Message', data.error);
            this.error = data.error;
          }
          else {
            this.message.sendMessage('success', 'App User Message', 'App User updated successfully !');
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

}
