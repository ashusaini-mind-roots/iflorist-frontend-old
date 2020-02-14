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
  }

  reloadData(){
    this.storeService.getStoreList().subscribe((data: any) =>{
      this.stores = data.stores;
      if(this.stores && this.stores.length > 0){
        this.storeIndexSelected = this.stores[0].id;
        this.populateSelectedStorage(this.stores[0]);
        // console.log(this.stores[0])
      }
      console.log("estoresss")
       console.log(data)
    });
	
	this.messageService.getMessageReloadStore().subscribe(message => {
	//console.log('aaaaa');
	
	this.storeService.getStoreList().subscribe((data: any) =>{
	  this.stores = data.stores;
	  if(this.stores && this.stores.length > 0){
		this.storeIndexSelected = this.stores[0].id;
		this.populateSelectedStorage(this.stores[0]);
		// console.log(this.stores[0])
	  }
	  console.log("estoresss")
	   console.log(data)
	});
		
	});
  }

  onStoreSelected(value){
    var foundStore = this.stores.filter(obj=>obj.id == value);
    console.log(foundStore[0]);
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


// import { Component, OnInit } from '@angular/core';
// import { StoreService } from "../../_services/store.service";
// import { MessageService } from "../../_services/message.service";
//
// @Component({
//   selector: 'app-stores-combo',
//   templateUrl: './stores-combo.component.html',
//   styleUrls: ['./stores-combo.component.less']
// })
// export class StoresComboComponent implements OnInit {
//
//   stores: Storage[] = [];
//   storeIndexSelected: number;
//
//   constructor(
//       private storeService: StoreService,
//       private messageService: MessageService,
//   ) { }
//
//   ngOnInit() {
//     this.reloadData();
//   }
//
//   reloadData(){
//     this.storeService.getStoreList().subscribe((data: any) =>{
//       this.stores = data.stores;
//       if(this.stores.length > 0){
//         this.storeIndexSelected = 0;
//         this.populateSelectedStorage(this.stores[0]);
//         console.log(this.stores[0])
//       }
//       console.log(this.stores)
//     })
//   }
//
//   onStoreSelected(value){
//     console.log(value);
//     console.log(this.stores[value]);
//     this.populateSelectedStorage(this.stores[value]);
//     this.sendMessage(this.stores[value]);
//   }
//
//   sendMessage(value): void {
//     // send message to subscribers via observable subject
//     this.messageService.sendMessage(value);
//   }
//
//   populateSelectedStorage(storage){
//     localStorage.setItem('selectedStorage', JSON.stringify(storage));
//   }
// }
