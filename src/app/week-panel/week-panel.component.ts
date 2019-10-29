import { Component, OnInit } from '@angular/core';
import { StoreSubscriberService } from "../_services/storeSubscriber.service";
import { UtilsService } from "../_services/utils.service";
import { WeekPanelService } from "../_services/weekPanel.service";
import { ActivatedRoute } from '@angular/router';
import {first} from "rxjs/operators";

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
  costOf: string;

  //------invoices
  invoices: any[];
  invoiceTotal: number;
  invoicesTableCols: any[];
  invoiceNumber_add : any;
  invoiceName_add : string;
  invoiceTotal_add : any;

  //------week resume
  projWeeklyRev: number;
  target: number;


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
      this.invoiceTotal = 0.00;
      this.projWeeklyRev = 0.00;
      this.target = 0.00;
  }

  ngOnInit() {
    this.selectedStorage = JSON.parse(localStorage.getItem('selectedStorage'));
    this.route.params.subscribe(params => {
        this.selectedWeekItem = params['id'];
    });
    this.route.params.subscribe(params => {
      this.costOf = params['cost_of'];
      console.log("costOf:" + this.costOf);
    });

    this.getWeeks();
    this.loadInvoicesTableHeaders();
  }

  receiveYearQuarter($event){
    this.yearQuarter = $event;
    this.getWeekDataFromServer();
  }
  receiveStorage(storage){
    this.selectedStorage = storage;
    this.getWeekDataFromServer();
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
      this.weekPanelService.getWeeks(this.yearQuarter.year).subscribe((response: any) =>{
      this.weekList = response.weeks;
      this.getWeekDataFromServer();
    });
  }

  getInvoices = function(){
      this.weekPanelService.getInvoices(this.costOf,this.selectedStorage.id,this.selectedWeekItem).subscribe((response: any) =>{
        this.invoices = response.invoices;
        this.calcInvoiceTotal();
      });
  }

  calcInvoiceTotal = function () {
    this.invoiceTotal = 0.00;
    for (var i = 0; i < this.invoices.length; i++) {
      this.invoiceTotal += parseFloat(this.invoices[i].total);
    }
    return this.invoiceTotal;
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
    this.getProjWeeklyRev();
    this.getInvoices();
    this.getTarget();
    // this.calcCostDifference();
    // this.getNotes();
  }

  loadInvoicesTableHeaders(){
    this.invoicesTableCols = [
      { field: 'invoice_name', header: 'Invoice Name' },
      { field: 'invoice_number', header: 'Invoice Number' },
      { field: 'total', header: 'Total' },
      { field: 'actions', header: 'Actions' }
    ];
  }

  createInvoice = function () {
    this.weekPanelService.createInvoice(this.costOf, this.invoiceNumber_add,this.invoiceName_add,
        this.invoiceTotal_add,this.selectedStorage.id,this.selectedWeekItem)
        .pipe(first())
        .subscribe(
            data => {
              //console.log(data);
              // this.loading = false;
              // this.success = 'Store added succefull !';
              // this.clean();
              //this.router.navigate([this.returnUrl]);
              this.getInvoices();
              this.calcInvoiceTotal();
            },
            error => {
              console.log(error)
              // this.error = error;
              // this.loading = false;
            });
  }

  getProjWeeklyRev = function () {
    this.weekPanelService.getProjWeeklyRev(this.selectedStorage.id,this.selectedWeekItem).subscribe((response: any) =>{
      this.projWeeklyRev = response.proj_weekly_rev;
    });
  }
  getTarget = function () {
    this.weekPanelService.getTarget(this.costOf).subscribe((response: any) =>{

      this.target = (this.costOf == 'fresh') ? response['target_cof'] : ((this.costOf == 'goods') ? response['target_cog'] : 0.00) ;
    });
  }

  getTargetInMoney = function () {
    return this.calcDailyTotal() * (this.target / 100);
  }

}
