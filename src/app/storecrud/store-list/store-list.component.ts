import { Observable } from "rxjs";
import { StoreService } from "../../_services/store.service";
// import { Store } from "../../_models/store";
import { Component, OnInit } from "@angular/core";
import { Router } from '@angular/router';


@Component({
  selector: 'app-store-list',
  templateUrl: './store-list.component.html',
  styleUrls: ['./store-list.component.less']
})
export class StoreListComponent implements OnInit {
  stores: any;

  constructor(
      private storeService: StoreService,
      private router: Router
  ) { }

  ngOnInit() {
   this.reloadData();
  }

  reloadData(){
    this.stores = this.storeService.getStoreList().subscribe((data:any) => {
        this.stores = data.stores;
        console.log(this.stores);
    });


  }
}
