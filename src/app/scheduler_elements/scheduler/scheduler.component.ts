import { Component, OnInit } from '@angular/core';
import { StoreSubscriberService } from "../../_services/storeSubscriber.service";
import { UtilsService } from "../../_services/utils.service";
import { WeekPanelService } from "../../_services/weekPanel.service";
import { SchedulerService } from "../../_services/scheduler.service";


@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.less']
})
export class SchedulerComponent implements OnInit {
  weekList: any[];
  selectedStorage: any;
  yearQuarter: any;
  selectedWeekItem: any;

  //------week resume
  //$scope.runningCOG = 0.00;
  targetCOL: number = 0.00;
  projWeeklyRev: number = 0.00;
  scheduledPayroll: number = 0.00;
  differenceCol: number = 0.00;
  projectedPayrol: number = 0.00;

  constructor(
      private storeSubscriberService: StoreSubscriberService,//service used to receive store from top bar stores combobox
      private utilService: UtilsService,
      private weekPanelService: WeekPanelService,
      private schedulerService: SchedulerService,
  )
  {
    storeSubscriberService.subscribe(this,function (ref,store) {
      ref.receiveStorage(store);
    });
    let currentYear = this.utilService.GetCurrentYear();
    this.yearQuarter = {year : currentYear, quarter: 1};
  }

  ngOnInit() {
    this.selectedStorage = JSON.parse(localStorage.getItem('selectedStorage'));
    this.getWeeks();
  }

  receiveStorage(storage){
    this.selectedStorage = storage;
  }
  receiveYearQuarter($event){
    this.yearQuarter = $event;
  }

  getWeeks = function () {
    this.weekPanelService.getWeeks(this.yearQuarter.year).subscribe((response: any) =>{
      this.weekList = response.weeks;
      this.selectedWeekItem = this.weekList[0].id;
      this.getWeekDataFromServer();
    });
  }

  getWeekDataFromServer = function () {
    this.getTargetCOL();
    this.getProjWeeklyRev();
    this.getScheduledPayroll();
  }

  getProjWeeklyRev = function () {
    this.schedulerService.getProjWeeklyRev(this.selectedStorage.id,this.selectedWeekItem).subscribe((response: any) =>{
      this.projWeeklyRev = response.proj_weekly_rev;
    });
  }
  calcProjectedPayRol = function () {
    return this.projectedPayrol = this.targetCOL * this.projWeeklyRev / 100;
  }
  getTargetCOL = function () {
    this.schedulerService.getTargetCOL(this.selectedStorage.id,this.selectedWeekItem).subscribe((response: any) =>{
      this.targetCOL = response.target_percentage;
    });
  }
  getScheduledPayroll = function () {
    this.schedulerService.getScheduledPayroll(this.selectedStorage.id,this.selectedWeekItem).subscribe((response: any) =>{
      this.scheduledPayroll= response.scheduled_payroll;
      this.calcDifferendeCOL();
    });
  }
  calcDifferendeCOL = function () {
    return this.differenceCol = this.projectedPayrol - this.scheduledPayroll;
  }


  }
