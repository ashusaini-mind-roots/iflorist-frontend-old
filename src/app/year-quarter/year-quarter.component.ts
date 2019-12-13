import { Component, Output, EventEmitter, OnInit, Input } from '@angular/core';
import {UtilsService} from "@app/_services/utils.service";

@Component({
  selector: 'app-year-quarter',
  templateUrl: './year-quarter.component.html',
  styleUrls: ['./year-quarter.component.less']
})
export class YearQuarterComponent implements OnInit {
  years: string[] = [];
  @Input() yearSelected: any;

  quarters: string[] = [];
  quarterSelected: any;

  @Output() yearQuarterOutput = new EventEmitter<any>();

  @Input() showQuarter:boolean = true;

  constructor(
      private utilService: UtilsService,
  ) { }

  ngOnInit() {
    let currentYear = this.utilService.GetCurrentYear();
    this.years = this.utilService.GetYears(currentYear - 1, currentYear  );
    if(this.yearSelected == undefined)
        this.yearSelected = currentYear;

    this.quarters = this.utilService.GetYears(1, 4);
    this.quarterSelected = 1;

    this.emitYearQuarter();
  }

  onYearOrQuarterChange(){
    this.emitYearQuarter();
  }
  emitYearQuarter(){
    this.yearQuarterOutput.emit({year: this.yearSelected, quarter: this.quarterSelected});
  }
}
