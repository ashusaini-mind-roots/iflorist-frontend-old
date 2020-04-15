import { ViewEncapsulation, Component, OnInit } from '@angular/core';
import { StoreSubscriberService } from "../_services/storeSubscriber.service";
import {TableModule} from 'primeng/table';
import {WeeklyProjectionService} from "../_services/weeklyprojection.service";
import { MessageToastService } from "../_services/messageToast.service";
import { UtilsService } from "../_services/utils.service";


@Component({
  selector: 'app-weeklyprojection',
  templateUrl: './weeklyprojection.component.html',
  styleUrls: ['./weeklyprojection.component.less'],
  /*encapsulation: ViewEncapsulation.None*/
})
export class WeeklyProjectionComponent implements OnInit {

  cols:any;
  yearIndexSelected:number;
  selectedStorage: any;
  proyections:any[];
  loading: boolean;
  adjustOptions: any[] = [] ;
  clonedProjections: { [s: string]: any; } = {};
  yearQuarter: any;
  projected_value_temp: number = -1;
  adjust_temp: number = -1;


  constructor(
    private storeSubscriberService: StoreSubscriberService,
    private projectionService: WeeklyProjectionService,
    private messageToastService: MessageToastService,
    private utilService: UtilsService,
  ) 
  {
    storeSubscriberService.subscribe(this,function (ref,store) {
      ref.receiveStorage(store);
    });
    let currentYear = this.utilService.GetCurrentYear();
    this.yearQuarter = {year : currentYear, quarter: 1};

    for (let i = 0 ; i <= 100 ; i+=5){
      this.adjustOptions.push({'option':i, 'value': '+' + i + '%'});
    }
    this.adjustOptions
  }

  ngOnInit() {
    this.loading = true;
  //  this.yearIndexSelected = 2019;
    // this.selectedStorage = 1;
    this.selectedStorage = JSON.parse(localStorage.getItem('selectedStorage'));
    this.loadHeaders();
    this.loadProjection();
  }

  loadHeaders(){
    this.cols = [
      { field: 'id', header: 'No' },
      { field: 'week', header: 'Week' },
      { field: 'year_reference' , header: this.yearQuarter.year  },//esto esta mal, hay ke poner los datos reales del year proyection y year reference
      { field: 'adjust', header: 'Adjust' },
      { field: 'year_proyection', header: Number(this.yearQuarter.year) + 1 },
      { field: 'actions', header: 'Actions' }
    ];

    // this.cols = [
    //   { field: 'id', header: 'No' },
    //   { field: 'week', header: 'Week' },
    //   { field: 'year-reference', header:'Year Reference' },//esto esta mal, hay ke poner los datos reales del year proyection y year reference
    //   { field: 'amt_total', header: 'Amt Total' },
    //   { field: 'year_proyection', header: 'Year Proyection' },
    //   // { field: 'event_override', header: 'Event Override' },
    //   { field: 'actions', header: 'Actions' }
    // ];

  }

  receiveYearQuarter($event){
    this.yearQuarter = $event;
    this.loadHeaders();
    this.loadProjection();
  }

  receiveStorage(storage){
    this.selectedStorage = storage;
    this.loadProjection();
  }

  loadProjection()
  {
    this.proyections = [];
    this.loading = true;
    this.projectionService.getProjectionList(this.selectedStorage.id,this.yearQuarter.year).subscribe((data: any) =>{
      this.proyections = data.projections;
      console.log(data)
      this.parseData(this.proyections);
     // console.log(this.proyections )
      this.loading = false;
    });
  }

  parseData(projections){
    for (let i = 0 ; i < projections.length ; i++){
      let p = projections[i];
      p.arraypos = i;
      // p.week_id = p.id;
      p.projection_id = p.id;
      p.id = i;
      // console.log(p.adjust,i)
      if(p.adjust == undefined){
        if(p.amt_total == 0)
          p.adjust = 0;
        else
          // p.adjust = Math.round((p.projected_value - p.amt_total) * 100 / p.amt_total);
        console.log(p.adjust)
      }
      else p.adjust = parseInt(p.adjust)

      if(p.adjust < 0) p.adjust = 0;
    }
  }

  onRowEditInit(projection: any) {
    let proj = {...projection};
    this.clonedProjections[projection.id] = proj;
    this.projected_value_temp = proj.projected_value;
    this.adjust_temp = proj.adjust;
    // console.log(this.projected_value_temp)
  }

  onRowEditSave(projections: any, index: number) {

        this.loading = true;
        this.projectionService.updateProyection(projections.projection_id,projections.adjust,
            projections.projected_value,projections.number,projections.store_id,projections.year_proyection ,projections.year_reference, projections.amt_total).subscribe(
              response=> {
                this.loading = false;
                delete this.clonedProjections[projections.id];
                this.messageToastService.sendMessage('success','Projection Message','Projection updated successfully !');

			   this.loadProjection();
			   console.log(response)
              },
              error => {
                this.proyections[index] = this.clonedProjections[projections.id];
                delete this.clonedProjections[projections.id];
                console.log(error)
                this.loading = false;
              }
        );
    this.cleanProjectedValue_and_Adjust_Temp();
  }

  onRowEditCancel(projections: any, index: number) {
      this.proyections[index] = this.clonedProjections[projections.id];
      delete this.clonedProjections[projections.id];
      this.cleanProjectedValue_and_Adjust_Temp();
  }

  adjustOnChange(value,pos){
    // console.log(value,pos);
    let increment = value * this.proyections[pos].amt_total / 100;
    this.proyections[pos].projected_value = this.round(parseFloat(this.proyections[pos].amt_total) + increment);
  }

  round(num){
    return Math.round((num + Number.EPSILON) * 100) / 100
  }

  cleanProjectedValue_and_Adjust_Temp(){
    this.projected_value_temp = -1;
    this.adjust_temp = -1;
  }

  projectedValueOnChange(value,pos)
  {
      if(this.projected_value_temp != value){
        this.proyections[pos].adjust = 0;
      }
      else this.proyections[pos].adjust = this.adjust_temp;
  }
}
