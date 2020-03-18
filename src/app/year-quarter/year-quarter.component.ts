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
    this.years = this.utilService.GetYears(currentYear - 4, currentYear  );
    if(this.yearSelected == undefined) {
      var yq = JSON.parse(localStorage.getItem('yearQuarter'));
      if (yq != undefined && yq.year != undefined)
        this.yearSelected = yq.year;
      else this.yearSelected = currentYear;
    }else
      this.yearSelected = currentYear;
    this.quarters = this.utilService.GetYears(1, 4);
    this.quarterSelected = 1;

    this.emitYearQuarter();
  }

  onYearOrQuarterChange(){
    this.emitYearQuarter();
  }
  emitYearQuarter(){
    localStorage.setItem('yearQuarter', JSON.stringify({year: this.yearSelected, quarter: this.quarterSelected}));
    this.yearQuarterOutput.emit({year: this.yearSelected, quarter: this.quarterSelected});
  }
}
