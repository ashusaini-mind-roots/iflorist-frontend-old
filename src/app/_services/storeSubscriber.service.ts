import { Injectable } from '@angular/core';
import { MessageService } from "./message.service";
import {Subscription} from "rxjs";

@Injectable({ providedIn: 'root' })
export class StoreSubscriberService{
    subscription: Subscription;
	
    constructor(private messageService: MessageService) { }

    subscribe(reference, callback_function){
        this.subscription = this.messageService.getMessage().subscribe(message => {
            if (message) {
                callback_function(reference,JSON.parse(localStorage.getItem('selectedStorage')))
                // this.selectedStorage = JSON.parse(localStorage.getItem('selectedStorage'));
                // this.receiveStorage(this.selectedStorage);
            }});
    }
}