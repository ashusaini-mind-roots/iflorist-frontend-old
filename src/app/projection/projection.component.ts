import { ViewEncapsulation, Component, OnInit } from '@angular/core';
import { StoreSubscriberService } from "../_services/storeSubscriber.service";
import {TableModule} from 'primeng/table';
import {ProjectionService} from "../_services/projection.service";
import { MessageToastService } from "../_services/messageToast.service";


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

  constructor(
    private storeSubscriberService: StoreSubscriberService,
    private projectionService: ProjectionService,
    private messageToastService: MessageToastService
  ) 
  {
    storeSubscriberService.subscribe(this,function (ref,store) {
      ref.receiveStorage(store);
    });
  }

  ngOnInit() {
    this.loading = true;
    this.yearIndexSelected = 2019;
    this.selectedStorage = 1;
    this.loadHeaders();
    this.loadProjection();
    
  }

  loadHeaders(){
    this.cols = [
      { field: 'id', header: 'No' },
      { field: 'week', header: 'Week' },
      { field: this.yearIndexSelected - 1, header: this.yearIndexSelected - 1 },
      { field: 'adjust', header: 'Adjust' },
      { field: 'year_proyection', header: this.yearIndexSelected },
      { field: 'event_override', header: 'Event Override' },
    ];
  }

  

  onYearSelected(yearIndexSelected:number)
  {
      console.log(yearIndexSelected);
      this.yearIndexSelected = yearIndexSelected;
      this.loadHeaders();
      this.loadProjection();
  }

  receiveStorage(storage){
    this.selectedStorage = storage.id;
    this.loadProjection();
    //this.reloadData();
    // console.log(this.yearQuarter);
    //console.log('akiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii');
  }

  loadProjection()
  {
    this.proyections = [];
    this.loading = true;
    this.projectionService.getProjectionList(this.selectedStorage,this.yearIndexSelected).subscribe((data: any) =>{
      console.log(data.projections);
      this.proyections = data.projections;
      this.loading = false;
    });
  }


  onRowEditInit(projections: any) {
    this.clonedProjections[projections.id] = {...projections};
    console.log(this.clonedProjections[projections.id]);
  }

  onRowEditSave(projections: any, index: number) {
      if (projections.amt_total >= 0) {
        
        this.loading = true;
        
        this.projectionService.updateProyection(projections.id,projections.amt_total,projections.adjust).subscribe(
              response=> {
                this.loading = false;
                delete this.clonedProjections[projections.id];
                this.messageToastService.sendMessage('success','Projection Message','Projection updated succefully !');
               // console.log(response)
              },
              error => {
                this.proyections[index] = this.clonedProjections[projections.id];
                delete this.clonedProjections[projections.id];
                console.log(error)
                this.loading = false;
              }
        );
              
      }
      else {
        this.proyections[index] = this.clonedProjections[projections.id];
        delete this.clonedProjections[projections.id];
      }
  }

  onRowEditCancel(projections: any, index: number) {
      this.proyections[index] = this.clonedProjections[projections.id];
      delete this.clonedProjections[projections.id];
  }

}
