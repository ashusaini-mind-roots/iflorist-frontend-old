import { ViewEncapsulation, Component, OnInit } from '@angular/core';
import { StoreSubscriberService } from "../_services/storeSubscriber.service";
import {TableModule} from 'primeng/table';
import {ProjectionService} from "../_services/projection.service";
import { MessageToastService } from "../_services/messageToast.service";
import { UtilsService } from "../_services/utils.service";


@Component({
  selector: 'app-projection',
  templateUrl: './projection.component.html',
  styleUrls: ['./projection.component.less'],
  /*encapsulation: ViewEncapsulation.None*/
})
export class ProjectionComponent implements OnInit {

  cols:any;
  yearIndexSelected:number;
  selectedStorage: any;
  proyections:any[];
  loading: boolean;

  clonedProjections: { [s: string]: any; } = {};

  yearQuarter: any;

  constructor(
    private storeSubscriberService: StoreSubscriberService,
    private projectionService: ProjectionService,
    private messageToastService: MessageToastService,
    private utilService: UtilsService,
  ) 
  {
    storeSubscriberService.subscribe(this,function (ref,store) {
      ref.receiveStorage(store);
    });
    let currentYear = this.utilService.GetCurrentYear();
    this.yearQuarter = {year : currentYear, quarter: 1};
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
      { field: this.yearQuarter.year - 1, header: this.yearQuarter.year - 1 },//esto esta mal, hay ke poner los datos reales del year proyection y year reference
      { field: 'adjust', header: 'Adjust' },
      { field: 'year_proyection', header: this.yearQuarter.year },
      // { field: 'event_override', header: 'Event Override' },
      { field: 'actions', header: 'Actions' }
    ];
  }

  receiveYearQuarter($event){
    this.yearQuarter = $event;
    //this.yearIndexSelected = this.yearQuarter.year;
console.log("juan")
     console.log(this.yearQuarter);
    // this.yearIndexSelected = yearIndexSelected;
    this.loadHeaders();
    this.loadProjection();
    // this.getWeekDataFromServer();
  }

  // onYearSelected(yearIndexSelected:number)
  // {
  //     console.log(yearIndexSelected);
  //     this.yearIndexSelected = yearIndexSelected;
  //     this.loadHeaders();
  //     this.loadProjection();
  // }

  receiveStorage(storage){
    this.selectedStorage = storage;
    //this.loadProjection();
  }

  loadProjection()
  {
    this.proyections = [];
    this.loading = true;
    console.log("pepepepe")
    console.log(this.yearQuarter.year)
    this.projectionService.getProjectionList(this.selectedStorage.id,this.yearQuarter.year).subscribe((data: any) =>{
     // console.log(data.projections);
      this.proyections = data.projections;
      this.loading = false;
    });
  }


  onRowEditInit(projections: any) {
    this.clonedProjections[projections.id] = {...projections};
  //  console.log(this.clonedProjections[projections.id]);
  }

  onRowEditSave(projections: any, index: number) {
      //if (projections.amt_total >= 0) {
        
        this.loading = true;
        
        this.projectionService.updateProyection(projections.id,projections.adjust).subscribe(
              response=> {
                this.loading = false;
                delete this.clonedProjections[projections.id];
                this.messageToastService.sendMessage('success','Projection Message','Projection updated successfully !');
               // console.log(response)
              },
              error => {
                this.proyections[index] = this.clonedProjections[projections.id];
                delete this.clonedProjections[projections.id];
                console.log(error)
                this.loading = false;
              }
        );
              
      //}
      // else {
      //   this.proyections[index] = this.clonedProjections[projections.id];
      //   delete this.clonedProjections[projections.id];
      // }
  }

  onRowEditCancel(projections: any, index: number) {
      this.proyections[index] = this.clonedProjections[projections.id];
      delete this.clonedProjections[projections.id];
  }

}
