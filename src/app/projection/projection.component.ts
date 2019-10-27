import { Component, OnInit } from '@angular/core';
import { StoreSubscriberService } from "../_services/storeSubscriber.service";
import {TableModule} from 'primeng/table';
import {ProjectionService} from "../_services/projection.service";

@Component({
  selector: 'app-projection',
  templateUrl: './projection.component.html',
  styleUrls: ['./projection.component.less']
})
export class ProjectionComponent implements OnInit {

  cols:any;
  yearIndexSelected:number;
  selectedStorage: any;
  proyections:any[];
  //store_id:number;

  constructor(
    private storeSubscriberService: StoreSubscriberService,
    private projectionService: ProjectionService
  ) 
  {
    storeSubscriberService.subscribe(this,function (ref,store) {
      ref.receiveStorage(store);
    });
  }

  ngOnInit() {
    this.yearIndexSelected = 2019;
    this.loadHeaders();
    this.loadProjection();
  }

  loadHeaders(){
    this.cols = [
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
  }

  receiveStorage(storage){
    this.selectedStorage = storage.id;
    this.loadProjection();
    //this.reloadData();
    // console.log(this.yearQuarter);
    console.log(this.selectedStorage);
  }

  loadProjection()
  {
    this.projectionService.getProjectionList(1,this.yearIndexSelected).subscribe((data: any) =>{
      console.log(data.projections);
      this.proyections = data.projections;
    });
  }

}
