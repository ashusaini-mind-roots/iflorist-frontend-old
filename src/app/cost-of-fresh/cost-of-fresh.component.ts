import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
// import { MessageService } from "../_services/message.service";
import { StoreSubscriberService } from "../_services/storeSubscriber.service";
import { CostOfFreshService } from "../_services/costOfFresh.service";

@Component({
  selector: 'app-cost-of-fresh',
  templateUrl: './cost-of-fresh.component.html',
  styleUrls: ['./cost-of-fresh.component.less']
})
export class CostOfFreshComponent implements OnInit {
  selectedStorage: String;
  weeks: any[] = [];
  yearQuarter: any;

  constructor(
      private costOfFreshService: CostOfFreshService,
      private storeSubscriberService: StoreSubscriberService,//service used to receive store from top bar stores combobox
      )
  {
    storeSubscriberService.subscribe(this,function (ref,store) {
      ref.receiveStorage(store);
    })
      // this.subscription = this.messageService.getMessage().subscribe(message => {
      //   if (message) {
      //     this.selectedStorage = JSON.parse(localStorage.getItem('selectedStorage'));
      //     this.receiveStorage(this.selectedStorage);
      // }});
  }

  ngOnInit() {
    this.selectedStorage = JSON.parse(localStorage.getItem('selectedStorage'));
    // console.log(this.selectedStorage)
    this.reloadData();
  }

  reloadData(){
    this.costOfFreshService.getMasterOverviewWeekly(1,2019).subscribe((data: any) =>{
      this.weeks = data.master_overview_weekly;
      // console.log(data);
    })
  }

  receiveYearQuarter($event){
    this.yearQuarter = $event;
    console.log(this.yearQuarter);
    console.log(this.selectedStorage);
  }
  receiveStorage(storage){
    this.selectedStorage = storage;
    console.log(this.yearQuarter);
    console.log(this.selectedStorage);
  }
}
