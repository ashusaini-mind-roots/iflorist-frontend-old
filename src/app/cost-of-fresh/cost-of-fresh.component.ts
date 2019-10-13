import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MessageService } from "../_services/message.service";

@Component({
  selector: 'app-cost-of-fresh',
  templateUrl: './cost-of-fresh.component.html',
  styleUrls: ['./cost-of-fresh.component.less']
})
export class CostOfFreshComponent implements OnInit {
  subscription: Subscription;
  store_id: String;

  constructor(private messageService: MessageService) {
    this.subscription = this.messageService.getMessage().subscribe(message => {
      if (message) {
        this.store_id = message;
        console.log(message)
    }});
  }

  ngOnInit() {
  }

}
