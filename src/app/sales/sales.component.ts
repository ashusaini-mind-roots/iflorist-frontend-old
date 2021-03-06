import { Component, OnInit } from '@angular/core';
import { StoreSubscriberService } from "../_services/storeSubscriber.service";
import { SalesService } from "../_services/sales.service";
import { UtilsService } from "../_services/utils.service";
import {TableModule} from 'primeng/table';
import {Observable} from "rxjs";
import {environment} from "@environments/environment";

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.less']
})
export class SalesComponent implements OnInit {
  selectedStorage: any;
  yearQuarter: any;
  weeks: any[];
  cols:any;
  colsSubtable:any;
  loading: boolean;
  clonedDays: { [s: string]: any; } = {};
  lineChartData : any;
  pieChartData : any;
  projWeeklyRevQuarter: number;
  actualSalesTotal: number;
  actualSalesByWeek: number[];
  projectedSalesByWeek: number[];

  constructor(
      private storeSubscriberService: StoreSubscriberService,//service used to receive store from top bar stores combobox
      private salesService: SalesService,
      private utilService: UtilsService,
  ) {
    storeSubscriberService.subscribe(this,function (ref,store) {
      ref.receiveStorage(store);
    });
    let currentYear = this.utilService.GetCurrentYear();
    this.yearQuarter = /*{year : currentYear, quarter: 1}*/JSON.parse(localStorage.getItem('yearQuarter'));
    this.projWeeklyRevQuarter = 0.00;
    this.actualSalesTotal = 0.00;
    this.actualSalesByWeek = new Array();
    this.projectedSalesByWeek = new Array();

  }

  initActualSalesByWeekArray(){
    this.actualSalesByWeek = [0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00];
    this.projectedSalesByWeek = [0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00];
  }

  receiveYearQuarter($event){
    this.yearQuarter = $event;
    this.getSales();
    // this.getProjectedSales();
  }

  receiveStorage(storage){
    this.selectedStorage = storage;
    this.getSales();
  }

  ngOnInit() {
    this.loading = true;
    this.selectedStorage = JSON.parse(localStorage.getItem('selectedStorage'));
    this.loadHeaders();
  }

  showLineChart(){
    this.lineChartData = {
      labels:['1','2','3','4', '5', '6', '7', '8','9', '10', '11', '12', '13'],
      datasets:[
        {
          label:'Actual Sales',
          backgroundColor: '#1caba0',
          borderColor: '#1caba0',
          data: this.actualSalesByWeek

        },
        {
          label:'Projected Sales',
          backgroundColor: '#ff596e',
          borderColor: '#ff596e',
          data: this.projectedSalesByWeek
        }
      ]
    };
  }
  showPieChart()
  {
      this.pieChartData = {
        legend: [
          {
             display: false,
          }
        ],
        datasets:[
          {
            label:['Actual Sales','Projected Sales'],
            backgroundColor: ['#1caba0','#ff596e'],
            data: [this.actualSalesTotal,this.projWeeklyRevQuarter],
            hoverBackgroundColor: ['#1caba0','#ff596e'],
          }
        ]
      };
  }
  getSales()
  {
    this.loading = true;
      this.salesService.getSales(this.selectedStorage.id,this.yearQuarter.year,this.yearQuarter.quarter).subscribe((response: any) =>{
        this.weeks = response.weeks;
        this.calcActualSalesTotal();
        this.getProjectedSales();
        console.log(this.weeks)
        this.loading = false;
      });
    this.loading = false;
  }

  calcActualSalesTotal(){
    this.actualSalesTotal = 0.00;
    this.initActualSalesByWeekArray();
    for (let i = 0; i < this.weeks.length; i++) {
      let total = this.weeks[i].totalDelivery + this.weeks[i].totalWire + this.weeks[i].totalMerchandise;
      this.actualSalesTotal += total;
      this.actualSalesByWeek[(this.weeks[i].number - (13 * (this.yearQuarter.quarter - 1)))-1] = total;
    }
  }

  loadHeaders(){
    this.cols = [
      { field: 'week', header: 'Week' },
      { field: 'merchandiseSales', header: 'Merchandise Sales' },
      { field: 'wireSales', header: 'Wire Sales' },
      { field: 'deliverySales', header: 'Delivery Sales' },
      { field: 'total', header: 'Total' },
    ];
  }

  onRowEditInit(days: any) {
    this.clonedDays[days.id] = {...days};
  }

  onRowEditSave(days: any, index: number) {
      if (days.merchandise >= 0 && days.wire >= 0 && days.delivery >= 0) {
        this.loading = true;
        this.salesService.updateDay(days.id,days.merchandise,days.wire,days.delivery).subscribe(
              response=> {
                this.loading = false;
                delete this.clonedDays[days.id];
                this.getSales();
              },
              error => {
                delete this.clonedDays[days.id];
                console.log(error)
                this.loading = false;
                this.getSales();
              }
        );
              
      }
      else {
        this.getSales();
      }
  }

  onRowEditCancel(days: any, index: number) {
    this.getSales();
  }

  /**
   * This function is just getProjWeeklyRevQuarter
   */
  getProjectedSales(){
    this.salesService.getProjWeeklyRevQuarter(this.selectedStorage.id,this.yearQuarter.year,this.yearQuarter.quarter).subscribe((response: any) =>{
      this.projWeeklyRevQuarter = response.proj_weekly_rev_quarter;
      this.projectedSalesByWeek = response.all_projected_sales;
      this.showPieChart();
      this.showLineChart();
    });
  }

}
