import { Component, OnInit } from '@angular/core';
import { StoreSubscriberService } from "../_services/storeSubscriber.service";
import { SalesService } from "../_services/sales.service";
import { UtilsService } from "../_services/utils.service";

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.less']
})
export class SalesComponent implements OnInit {
  selectedStorage: any;
  yearQuarter: any;
  weeks: any[];

  constructor(
      private storeSubscriberService: StoreSubscriberService,//service used to receive store from top bar stores combobox
      private salesService: SalesService,
      private utilService: UtilsService,
  ) {
    storeSubscriberService.subscribe(this,function (ref,store) {
      ref.receiveStorage(store);
    });
    let currentYear = this.utilService.GetCurrentYear();
    this.yearQuarter = {year : currentYear, quarter: 1};
  }
  receiveYearQuarter($event){
    this.yearQuarter = $event;
  }
  receiveStorage(storage){
    this.selectedStorage = storage;
  }
  ngOnInit() {
    this.selectedStorage = JSON.parse(localStorage.getItem('selectedStorage'));
    this.getSales();
  }

  getSales()
  {
      //get sales list
    console.log(this.selectedStorage.id + " -- " + this.yearQuarter.quarter)
      this.salesService.getSales(this.selectedStorage.id,this.yearQuarter.year,this.yearQuarter.quarter).subscribe((response: any) =>{
        this.weeks = response.weeks;
        console.log(this.weeks);
      });
  }

}
