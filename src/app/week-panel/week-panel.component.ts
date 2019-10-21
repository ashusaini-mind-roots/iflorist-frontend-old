import { Component, OnInit } from '@angular/core';
import { StoreSubscriberService } from "../_services/storeSubscriber.service";
import { UtilsService } from "../_services/utils.service";
import { WeekPanelService } from "../_services/weekPanel.service";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-week-panel',
  templateUrl: './week-panel.component.html',
  styleUrls: ['./week-panel.component.less']
})
export class WeekPanelComponent implements OnInit {
  selectedStorage: any;
  yearQuarter: any;

  monday: any;
  tuesday: any;
  wednesday: any;
  thursday: any;
  friday: any;
  saturday: any;
  sunday: any;

  dailyRevenueTotal: any;

  weekList: any[];
  selectedWeekItem: any;

  constructor(
      private storeSubscriberService: StoreSubscriberService,//service used to receive store from top bar stores combobox
      private utilService: UtilsService,
      private weekPanelService: WeekPanelService,
      private route: ActivatedRoute,
  )
  {
      storeSubscriberService.subscribe(this,function (ref,store) {
        ref.receiveStorage(store);
      });
      let currentYear = this.utilService.GetCurrentYear();
      this.yearQuarter = {year : currentYear, quarter: 1};

      this.monday = {'id': -1, 'amt': 0.00};
      this.tuesday = {'id': -1, 'amt': 0.00};
      this.wednesday = {'id': -1, 'amt': 0.00};
      this.thursday = {'id': -1, 'amt': 0.00};
      this.friday = {'id': -1, 'amt': 0.00};
      this.saturday = {'id': -1, 'amt': 0.00};
      this.sunday = {'id': -1, 'amt': 0.00};
      this.dailyRevenueTotal = 0.00;
      this.selectedWeekItem = "3";
  }

  ngOnInit() {
    this.selectedStorage = JSON.parse(localStorage.getItem('selectedStorage'));
    this.route.params.subscribe(params => {
        this.selectedWeekItem = params['id'];
    });


    this.getWeeks();
  }

  receiveYearQuarter($event){
    this.yearQuarter = $event;
    this.getWeekDataFromServer();
   // this.reloadData();
    // console.log(this.yearQuarter);
    // console.log(this.selectedStorage);
  }
  receiveStorage(storage){
    this.selectedStorage = storage;
    this.getWeekDataFromServer();
    console.log("storage");
    console.log(this.selectedStorage)
    //this.reloadData();
    // console.log(this.yearQuarter);
    // console.log(this.selectedStorage);
  }

  calcDailyTotal = function () {
    this.dailyRevenueTotal =
        parseFloat(this.monday.amt) +
        parseFloat(this.tuesday.amt) +
        parseFloat(this.wednesday.amt) +
        parseFloat(this.thursday.amt) +
        parseFloat(this.friday.amt) +
        parseFloat(this.saturday.amt) +
        parseFloat(this.sunday.amt);
    return this.dailyRevenueTotal;
  }

  getSevenDays = function () {
     console.log(this.selectedStorage)
    this.weekPanelService.getSevenDays(this.selectedStorage.id,this.selectedWeekItem).subscribe((response: any) =>{
        let seven_d_w = response.seven_days_week;
        // console.log(seven_d_w);
        if (Array.isArray(seven_d_w) && seven_d_w.length > 0) {
          this.monday = {
            'id': seven_d_w[0].id,
            'amt_formatted': '$' + this.formatMoney(seven_d_w[0].amt),
            'amt': parseFloat(seven_d_w[0].amt),
            'dates_dim_date': seven_d_w[0].dates_dim_date
          };
          this.tuesday = {
            'id': seven_d_w[1].id,
            'amt_formatted': '$' + this.formatMoney(seven_d_w[1].amt),
            'amt': parseFloat(seven_d_w[1].amt),
            'dates_dim_date': seven_d_w[1].dates_dim_date
          };
          this.wednesday = {
            'id': seven_d_w[2].id,
            'amt_formatted': '$' + this.formatMoney(seven_d_w[2].amt),
            'amt': parseFloat(seven_d_w[2].amt),
            'dates_dim_date': seven_d_w[2].dates_dim_date
          };
          this.thursday = {
            'id': seven_d_w[3].id,
            'amt_formatted': '$' + this.formatMoney(seven_d_w[3].amt),
            'amt': parseFloat(seven_d_w[3].amt),
            'dates_dim_date': seven_d_w[3].dates_dim_date
          };
          this.friday = {
            'id': seven_d_w[4].id,
            'amt_formatted': '$' + this.formatMoney(seven_d_w[4].amt),
            'amt': parseFloat(seven_d_w[4].amt),
            'dates_dim_date': seven_d_w[4].dates_dim_date
          };
          this.saturday = {
            'id': seven_d_w[5].id,
            'amt_formatted': '$' + this.formatMoney(seven_d_w[5].amt),
            'amt': parseFloat(seven_d_w[5].amt),
            'dates_dim_date': seven_d_w[5].dates_dim_date
          };
          this.sunday = {
            'id': seven_d_w[6].id,
            'amt_formatted': '$' + this.formatMoney(seven_d_w[6].amt),
            'amt': parseFloat(seven_d_w[6].amt),
            'dates_dim_date': seven_d_w[6].dates_dim_date
          };
          this.calcDailyTotal();
         // this.saveDays_btnDisable = false;
        } else {
          this.clearSevenDays();
        }
    })
  }

  getWeeks = function () {
    console.log(this.yearQuarter.year);

      this.weekPanelService.getWeeks(this.yearQuarter.year).subscribe((response: any) =>{
        this.weekList = response.weeks;
      });
      this.getWeekDataFromServer();
  }

  formatMoney(amount, decimalCount = 2, decimal = ".", thousands = ",") {
    try {
      decimalCount = Math.abs(decimalCount);
      decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

      const negativeSign = amount < 0 ? "-" : "";

      let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
      let j = (i.length > 3) ? i.length % 3 : 0;

      return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - (+i)).toFixed(decimalCount).slice(2) : "");
    } catch (e) {
      console.log(e)
    }
  }

  clearSevenDays = function () {
    this.monday = {'id': -1, 'amt': 0.00};
    this.tuesday = {'id': -1, 'amt': 0.00};
    this.wednesday = {'id': -1, 'amt': 0.00};
    this.thursday = {'id': -1, 'amt': 0.00};
    this.friday = {'id': -1, 'amt': 0.00};
    this.saturday = {'id': -1, 'amt': 0.00};
    this.sunday = {'id': -1, 'amt': 0.00};
    this.dailyRevenueTotal = 0.00;
   // this.saveDays_btnDisable = true;
  }

  getWeekDataFromServer() {
    this.getSevenDays();
    // this.getProjWeeklyRev();
    // this.getInvoices();
    // this.getTargetCOG();
    // this.calcCostDifference();
    // this.getNotes();
  }


}
