import { Component, OnInit } from '@angular/core';
import { StoreService } from "../../_services/store.service";
import { MessageService } from "../../_services/message.service";

@Component({
  selector: 'app-stores-combo',
  templateUrl: './stores-combo.component.html',
  styleUrls: ['./stores-combo.component.less']
})
export class StoresComboComponent implements OnInit {

  stores: Storage[] = [];
  storeIndexSelected: number;

  constructor(
      private storeService: StoreService,
      private messageService: MessageService,
  ) { }

  ngOnInit() {
    this.reloadData();
	this.messageService.getMessageReloadStore().subscribe(message => {
		this.storeService.getStoreList().subscribe((data: any) =>{
		  this.stores = data.stores;
		});
		
	});
  }

  reloadData(){
    this.storeService.getStoreList().subscribe((data: any) =>{
      this.stores = data.stores;
      if(this.stores && this.stores.length > 0){
        this.storeIndexSelected = this.stores[0].id;
        this.populateSelectedStorage(this.stores[0]);
      }
    });
  }

  onStoreSelected(value){
    var foundStore = this.stores.filter(obj=>obj.id == value);
    this.populateSelectedStorage(foundStore[0]);
    this.sendMessage(foundStore[0]);
  }

  sendMessage(value): void {
    // send message to subscribers via observable subject
    this.messageService.sendMessage(value);
  }

  populateSelectedStorage(storage){
    localStorage.setItem('selectedStorage', JSON.stringify(storage));
  }
}
