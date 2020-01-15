import { Component, OnInit } from '@angular/core';
import { StoreSubscriberService } from "../../_services/storeSubscriber.service";
import { UtilsService } from "../../_services/utils.service";
import { AppUserService } from "../../_services/appUser.service";

@Component({
  selector: 'app-app-user-list',
  templateUrl: './app-user-list.component.html',
  styleUrls: ['./app-user-list.component.less']
})
export class AppUserListComponent implements OnInit {
	
  selectedStorage: any;
  appUsers: any[];	
  cols: any;	

  constructor(
	  private storeSubscriberService: StoreSubscriberService,//service used to receive store from top bar stores combobox
      private utilService: UtilsService,
      private appUserService: AppUserService,
  ) {
		storeSubscriberService.subscribe(this,function (ref,store) {
			ref.receiveStorage(store);
		});
  }

  ngOnInit() {
	  this.loadHeaders();
	  this.selectedStorage = JSON.parse(localStorage.getItem('selectedStorage'));
      this.getAppUsers();
  }
  
  loadHeaders(){
    this.cols = [
      { field: 'name', header: 'Name' },
      { field: 'email', header: 'Email Address' },
	  { field: 'active', header: 'Active' },
    ];
  }
  
  receiveStorage(storage){
    this.selectedStorage = storage;
    console.log(storage.id)
    this.getAppUsers();
  }
  
  getAppUsers()
  {
    this.appUserService.getAppUserList(this.selectedStorage.id).subscribe((response: any) =>{
      this.appUsers = response.appUsers;
	  console.log(this.appUsers);
    });
  }

}
