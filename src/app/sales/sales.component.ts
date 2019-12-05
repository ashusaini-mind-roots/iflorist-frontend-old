import { Component, OnInit } from '@angular/core';
import { StoreSubscriberService } from "../_services/storeSubscriber.service";
import { SalesService } from "../_services/sales.service";
import { UtilsService } from "../_services/utils.service";
import {TableModule} from 'primeng/table';

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
    this.getSales();
  }

  receiveStorage(storage){
    //this.selectedStorage = storage.id;
    this.selectedStorage = storage;
    this.getSales();
  }

  ngOnInit() {
    this.loading = true;
    this.selectedStorage = JSON.parse(localStorage.getItem('selectedStorage'));
    this.getSales();
    this.loadHeaders();

    this.lineChartData = {
      labels:['1','2','3','4', '5', '6', '7', '8','9', '10', '11', '12', '13'],
      datasets:[
        {
          label:'Actual Sales',
          backgroundColor: '#1caba0',
          borderColor: '#1caba0',
          data: [65,59,80,81,56,55,40,65,59,80,81,56,55]

        },
        {
          label:'Projected Sales',
          backgroundColor: '#ff596e',
          borderColor: '#ff596e',
          data: [28, 48, 40, 19, 86, 27, 90,28, 48, 40, 19, 86, 27]

        }
      ]
    };

    this.pieChartData = {
      labels:['Actual Sales','Projected Sales'],
      datasets:[
        {
          backgroundColor: ['#1caba0','#ff596e'],
          data: [100,30],
          hoverBackgroundColor: ['#1caba0','#ff596e'],
        }
      ]
    };
  }

  getSales()
  {
      //get sales list
    this.loading = true;
    console.log(this.selectedStorage.id + " -- " + this.yearQuarter.quarter)
      this.salesService.getSales(this.selectedStorage.id,this.yearQuarter.year,this.yearQuarter.quarter).subscribe((response: any) =>{
        this.weeks = response.weeks;
        console.log(this.weeks);
        this.loading = false;
      });
    this.loading = false;
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
    console.log(this.clonedDays[days.id]);
  }

  onRowEditSave(days: any, index: number) {
      if (days.merchandise >= 0 && days.wire >= 0 && days.delivery >= 0) {
        
        this.loading = true;
        
        this.salesService.updateDay(days.id,days.merchandise,days.wire,days.delivery).subscribe(
              response=> {
                this.loading = false;
                delete this.clonedDays[days.id];
                this.getSales();
               // console.log(response)
              },
              error => {
                //this.proyections[index] = this.clonedProjections[projections.id];
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


}
