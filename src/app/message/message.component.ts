import { Component, OnInit } from '@angular/core';
import {MessageService} from 'primeng/api';
import { MessageToastService } from "../_services/messageToast.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.less'],
  providers: [MessageService]
})
export class MessageComponent implements OnInit {

  subscription: Subscription;

  constructor(private messageService: MessageService, private messageToastService: MessageToastService) { }

  ngOnInit() {
    this.subscription = this.messageToastService.getMessage().subscribe(message => {
      if (message) {
        this.messageService.add({severity:message.severity, summary:message.summary, detail:message.detail});
          // this.selectedStorage = JSON.parse(localStorage.getItem('selectedStorage'));
          // this.receiveStorage(this.selectedStorage);
      }});
  }

}
