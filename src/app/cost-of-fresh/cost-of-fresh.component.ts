import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
// import { MessageService } from "../_services/message.service";
import { StoreSubscriberService } from "../_services/storeSubscriber.service";
import { CostOfFreshService } from "../_services/costOfFresh.service";
import {utils} from "protractor";
import {UtilsService} from "../_services/utils.service";

@Component({
  selector: 'app-cost-of-fresh',
  templateUrl: './cost-of-fresh.component.html',
  styleUrls: ['./cost-of-fresh.component.less']
})
export class CostOfFreshComponent implements OnInit {
  selectedStorage: String;
  weeks: any[] = [];
  yearQuarter: any;

  cols: any[];

  constructor(
      private costOfFreshService: CostOfFreshService,
      private storeSubscriberService: StoreSubscriberService,//service used to receive store from top bar stores combobox
      private utilService: UtilsService,
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
    this.yearQuarter = {year : this.utilService.GetCurrentYear(), quarter: 1};
  }

  ngOnInit() {
    this.selectedStorage = JSON.parse(localStorage.getItem('selectedStorage'));
    // console.log(this.selectedStorage)
    this.reloadData();
    this.loadHeaders();
  }

  reloadData(){
     console.log(this.selectedStorage.id + "-" +this.yearQuarter.year);
    this.costOfFreshService.getMasterOverviewWeekly(this.selectedStorage.id,this.yearQuarter.year).subscribe((data: any) =>{
      this.weeks = data.master_overview_weekly;
      // console.log(this.weeks);
    })
  }

  receiveYearQuarter($event){
    this.yearQuarter = $event;
    this.reloadData();
    // console.log(this.yearQuarter);
    // console.log(this.selectedStorage);
  }
  receiveStorage(storage){
    this.selectedStorage = storage;
    this.reloadData();
    // console.log(this.yearQuarter);
    // console.log(this.selectedStorage);
  }

  loadHeaders(){
    this.cols = [
      { field: 'week_number', header: 'Week' },
      { field: 'week_ending', header: 'Week Ending' },
      { field: 'week_ending_date', header: 'Ending Date' },
      { field: 'projected_weekly_revenue', header: 'Projected Revenue' },
      { field: 'actual_weekly_revenue', header: 'Actual Sales' },
      { field: 'actions', header: 'Actions' }
    ];
  }

}
