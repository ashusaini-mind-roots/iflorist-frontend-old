import { Component, OnInit } from '@angular/core';
import { StoreSubscriberService } from "../../_services/storeSubscriber.service";
import { UtilsService } from "../../_services/utils.service";
import { WeekPanelService } from "../../_services/weekPanel.service";
import { SchedulerService } from "../../_services/scheduler.service";
import { CheckRole } from "../../_helpers/check-role";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageToastService } from '../../_services/messageToast.service';
import { MessageService } from "../../_services/message.service";


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
  visibleDialogTarget: boolean = false;
  targetform: FormGroup;
  submittedFormTarget: boolean = false;

  //------week resume
  //$scope.runningCOG = 0.00;
  targetCOL: number = 0.00;
  projWeeklyRev: number = 0.00;
  scheduledPayroll: number = 0.00;
  differenceCol: number = 0.00;
  projectedPayrol: number = 0.00;

  title: string = "Finance View";
  displayList: boolean = true;

  constructor(
      private storeSubscriberService: StoreSubscriberService,//service used to receive store from top bar stores combobox
      private utilService: UtilsService,
      private weekPanelService: WeekPanelService,
      private schedulerService: SchedulerService,
	  private checkRole: CheckRole,
	  private formBuilder: FormBuilder,
	  private message: MessageToastService,
      private messageService: MessageService,
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
	this.targetform = this.formBuilder.group({
      target: ['', Validators.required],
    });

    this.messageService.getChangeDisplayModeData().subscribe(message => {
      this.displayList = message;
      if(this.displayList == true)
        this.title = "Finance View";
      else this.title = "Scheduler";
    });
  }
  
  get t() { return this.targetform.controls; }

  receiveStorage(storage){
    this.selectedStorage = storage;
    this.getWeeks();
  }
  receiveYearQuarter($event){
    this.yearQuarter = $event;
    this.getWeeks();
  }

  getWeeks = function () {
    this.weekPanelService.getWeeks(this.yearQuarter.year).subscribe((response: any) => {
      this.weekList = response.weeks;
      if (response.weeks.length > 0) {
        this.selectedWeekItem = this.weekList[0].id;
        this.settingStringFormatToWeekLisElements(this.weekList);
        this.getWeekDataFromServer();
      }
    });
  }

  settingStringFormatToWeekLisElements = function(weekList){
    for (let i = 0 ; i < weekList.length ; i++){
      var parts = weekList[i].date.split('-');
      var dateFormatted = new Date(parts[0], parts[1] - 1, parts[2]);
      this.weekList[i].dateObject = dateFormatted;
      this.weekList[i].stringFormat = this.utilService.getStringMonthDay(dateFormatted);
    }
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
      this.targetCOL = (response == null) ? 0 : response.target_percentage;
	  this.t.target.setValue(this.targetCOL);
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
  
  get hasAcces() {
        if(this.checkRole.isRoot() || this.checkRole.isCompanyAdmin() || this.checkRole.isStoreManager())
		  return true;
		else return false;
	}
	
	updayeTarget(){
    this.submittedFormTarget = true;

    // stop here if form is invalid
    if (this.targetform.invalid) {
      return;
    }
	
	this.visibleDialogTarget = false;	
    
    this.schedulerService.updateTargetCOL(this.selectedStorage.id,this.selectedWeekItem,this.t.target.value)
        .subscribe(
            data => {
			  let response = data; 	
			  if(response.status=='error')
			      this.message.sendMessage('error', 'Schedule Message', response.errors);
			  else
			  {
				  this.message.sendMessage('success', 'Schedule Message', 'Target updated successfully !');
				  this.submittedFormTarget = false;
				  this.getTargetCOL();
			  }
			},
            error => {
			  
			  this.message.sendMessage('error', 'Schedule Message', error);
              //this.error = error;
        });
  }

}
