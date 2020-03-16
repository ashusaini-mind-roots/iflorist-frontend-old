import {Component, Input, OnInit} from '@angular/core';
import { MessageService } from "../../_services/message.service";

@Component({
  selector: 'app-filter-input-list',
  templateUrl: './filter-input-list.component.html',
  styleUrls: ['./filter-input-list.component.less']
})
export class FilterInputListComponent implements OnInit {
	
  displayList: boolean = true;
  @Input() hideFilter: boolean = false;

  constructor(private messageService: MessageService) { }

  ngOnInit() {
  }
  
  changeDisplayData(data:boolean)
  {
	  this.displayList = data;
	  this.messageService.sendChangeDisplayModeData(data);
  }
  
  filterByText(texto:string)
  {
     this.messageService.sendFilterText(texto);
  }

}
