import { Observable } from "rxjs";
import { StoreService } from "../../_services/store.service";
import { Store } from "../../_models/store";
import { Component, OnInit } from "@angular/core";
import { Router } from '@angular/router';
import {TableModule} from 'primeng/table';


@Component({
  selector: 'app-store-list',
  templateUrl: './store-list.component.html',
  styleUrls: ['./store-list.component.less']
})
export class StoreListComponent implements OnInit {
  stores: any = [];

  cols: any[];

  constructor(
      private storeService: StoreService,
      private router: Router
  ) {
      // this.stores = Array
  }

  ngOnInit() {
   this.reloadData();
   this.loadHeaders();
  }

  reloadData(){
   this.storeService.getStoreList().subscribe((data: any) =>{
      this.stores = data.stores;
	  console.log(this.stores);
    })
  }

  loadHeaders(){
    this.cols = [
      { field: 'store_name', header: 'Store Name' },
      { field: 'contact_email', header: 'Email Address' },
      { field: 'contact_phone', header: 'Phone Number' },
      { field: 'address', header: 'Address' },
      { field: 'zip_code', header: 'ZipCode' },
      { field: 'actions', header: 'Actions' }
    ];
  }

}
