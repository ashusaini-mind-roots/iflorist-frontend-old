import { Observable } from "rxjs";
import { StoreService } from "../../_services/store.service";
import { Store } from "../../_models/store";
import { Component, OnInit } from "@angular/core";
import { Router } from '@angular/router';


@Component({
  selector: 'app-store-list',
  templateUrl: './store-list.component.html',
  styleUrls: ['./store-list.component.less']
})
export class StoreListComponent implements OnInit {
  stores: Storage[] = [];

  constructor(
      private storeService: StoreService,
      private router: Router
  ) {
      // this.stores = Array
  }

  ngOnInit() {
   this.reloadData();
  }

  reloadData(){
   this.storeService.getStoreList().subscribe((data: any) =>{
      this.stores = data.stores;
    })
  }
}
