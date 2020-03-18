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
      { field: 'actions', header: 'Actions' }
    ];
  }

  receiveYearQuarter($event){
    this.yearQuarter = $event;
    this.loadHeaders();
    this.loadProjection();
  }

  receiveStorage(storage){
    this.selectedStorage = storage;
  }

  loadProjection()
  {
    this.proyections = [];
    this.loading = true;
    this.projectionService.getProjectionList(this.selectedStorage.id,this.yearQuarter.year).subscribe((data: any) =>{
      this.proyections = data.projections;
      this.loading = false;
    });
  }

  onRowEditInit(projections: any) {
    this.clonedProjections[projections.id] = {...projections};
  }

  onRowEditSave(projections: any, index: number) {
      this.loading = true;
      this.projectionService.updateProyection(projections.id,projections.adjust).subscribe(
            response=> {
              this.loading = false;
              delete this.clonedProjections[projections.id];
              this.messageToastService.sendMessage('success','Projection Message','Projection updated successfully !');
            },
            error => {
              this.proyections[index] = this.clonedProjections[projections.id];
              delete this.clonedProjections[projections.id];
              this.loading = false;
            }
      );
  }

  onRowEditCancel(projections: any, index: number) {
      this.proyections[index] = this.clonedProjections[projections.id];
      delete this.clonedProjections[projections.id];
  }

}
