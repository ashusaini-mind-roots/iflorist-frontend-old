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
  stores: Storage[] = [];

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
    })
  }

  loadHeaders(){
    this.cols = [
      { field: 'store_name', header: 'Name' },
      { field: 'contact_phone', header: 'Contact phone' },
      { field: 'contact_email', header: 'Email' },
      { field: 'zip_code', header: 'ZipCode' },
      { field: 'address', header: 'Address' },
      { field: 'actions', header: 'Actions' }
    ];
  }

}
