import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
// import { MessageService } from "../_services/message.service";
import { StoreSubscriberService } from "../_services/storeSubscriber.service";
import { CostOfFreshService } from "../_services/costOfFresh.service";
import {utils} from "protractor";
import {UtilsService} from "../_services/utils.service";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cost-of-fresh',
  templateUrl: './cost-of-fresh.component.html',
  styleUrls: ['./cost-of-fresh.component.less']
})
export class CostOfFreshComponent implements OnInit {
  selectedStorage: any;
  weeks: any[] = [];
  yearQuarter: any;
  costOf: string;
  target: any;
  cols: any[];
  title: string

  constructor(
      private costOfFreshService: CostOfFreshService,
      private storeSubscriberService: StoreSubscriberService,//service used to receive store from top bar stores combobox
      private utilService: UtilsService,
      private route: ActivatedRoute,
      )
  {
      storeSubscriberService.subscribe(this,function (ref,store) {
        ref.receiveStorage(store);
      });
      this.yearQuarter = {year : this.utilService.GetCurrentYear(), quarter: 1};
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.costOf = params['what'];

      if(this.costOf == 'fresh')
        this.title = 'Fresh';
      else this.title = 'Hard Goods';

      this.selectedStorage = JSON.parse(localStorage.getItem('selectedStorage'));
      this.reloadData();
      this.loadHeaders();
    });
  }

  reloadData(){
    this.costOfFreshService.getMasterOverviewWeekly(this.costOf,this.selectedStorage.id,this.yearQuarter.year,this.yearQuarter.quarter).subscribe((data: any) =>{
      this.weeks = data.master_overview_weekly;
      if(this.weeks.length > 0)
        this.target = this.weeks[0].target;
    })
  }

  receiveYearQuarter($event){
    this.yearQuarter = $event;
    this.reloadData();
  }
  receiveStorage(storage){
    this.selectedStorage = storage;
    this.reloadData();
  }

  loadHeaders(){
    this.cols = [
      { field: 'week_number', header: 'Week' },
      { field: 'week_ending', header: 'Week Ending' },
      { field: 'week_ending_date', header: 'Ending Date' },
      { field: 'projected_weekly_revenue', header: 'Projected Revenue' },
      { field: 'actual_weekly_revenue', header: 'Actual Sales' },
      { field: 'weekly_cog_total', header: 'Costs' },
      { field: 'difference', header: 'Difference' },
      { field: 'actions', header: 'Actions' }
    ];
  }

}
