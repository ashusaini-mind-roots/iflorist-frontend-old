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
  storeSelected: number;

  constructor(
      private storeService: StoreService,
      private messageService: MessageService,
  ) { }

  ngOnInit() {
    this.reloadData();
  }

  reloadData(){
    this.storeService.getStoreList().subscribe((data: any) =>{
      this.stores = data.stores;
      if(this.stores.length > 0)
        this.storeSelected = this.stores[0].id;
      console.log(this.stores)
    })
  }

  onStoreSelected(value:String){
    console.log(value);
    this.sendMessage(value);
  }

  sendMessage(value): void {
    // send message to subscribers via observable subject
    this.messageService.sendMessage(value);
  }
}
