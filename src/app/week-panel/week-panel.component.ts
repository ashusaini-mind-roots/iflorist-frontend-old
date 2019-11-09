import { Component, OnInit } from '@angular/core';
import { StoreSubscriberService } from "../_services/storeSubscriber.service";
import { UtilsService } from "../_services/utils.service";
import { WeekPanelService } from "../_services/weekPanel.service";
import { ActivatedRoute } from '@angular/router';
import {first} from "rxjs/operators";
// import {DialogModule} from 'primeng/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {ConfirmationService} from 'primeng/api';

import { MessageToastService } from "../_services/messageToast.service";

@Component({
  selector: 'app-week-panel',
  templateUrl: './week-panel.component.html',
  styleUrls: ['./week-panel.component.less'],
  providers: [ConfirmationService]
})
export class WeekPanelComponent implements OnInit {
  selectedStorage: any;
  yearQuarter: any;
  monday: any;
  tuesday: any;
  wednesday: any;
  thursday: any;
  friday: any;
  saturday: any;
  sunday: any;
  dailyRevenueTotal: any;
  weekList: any[];
  selectedWeekItem: any;
  costOf: string;
  visible:boolean = false;
  visibleDialogNote: boolean = false;
  title:string;
  dialogValues : any;
  dayform: FormGroup;
  noteform: FormGroup;
  submitted = false;
  submittedFormNote: boolean = false;
  error = '';
  yearSelected: string;
  notesYearSelected : any[];
  oldNotes:any[];
  cols : any[];
  noteDelete : string = '';

  //------invoices
  invoices: any[];
  invoiceTotal: number;
  invoicesTableCols: any[];
  invoiceNumber_add : any;
  invoiceName_add : string;
  invoiceTotal_add : any;

  //------week resume
  projWeeklyRev: number;
  target: number;


  constructor(
      private formBuilder: FormBuilder,
      private storeSubscriberService: StoreSubscriberService,//service used to receive store from top bar stores combobox
      private utilService: UtilsService,
      private weekPanelService: WeekPanelService,
      private route: ActivatedRoute,
      private messageToastService: MessageToastService,
      private confirmationService: ConfirmationService
  )
  {
      storeSubscriberService.subscribe(this,function (ref,store) {
        ref.receiveStorage(store);
      });
      let currentYear = this.utilService.GetCurrentYear();
      this.yearQuarter = {year : currentYear, quarter: 1};
      this.yearSelected = this.yearQuarter.year;

      this.monday = {'id': -1, 'amt': 0.00};
      this.tuesday = {'id': -1, 'amt': 0.00};
      this.wednesday = {'id': -1, 'amt': 0.00};
      this.thursday = {'id': -1, 'amt': 0.00};
      this.friday = {'id': -1, 'amt': 0.00};
      this.saturday = {'id': -1, 'amt': 0.00};
      this.sunday = {'id': -1, 'amt': 0.00};
      this.dailyRevenueTotal = 0.00;
      this.selectedWeekItem = "3";
      this.invoiceTotal = 0.00;
      this.projWeeklyRev = 0.00;
      this.target = 0.00;

      this.dialogValues = {'id':0,'merchandise': 0.00,'wire': 0.00,'delivery': 0.00};
  }

  ngOnInit() {
    this.dayform = this.formBuilder.group({
      id: [''],
      merchandise: ['', Validators.required],
      wire: ['',  Validators.required],
      delivery: ['',Validators.required],
    });

    this.noteform = this.formBuilder.group({
      text: ['', Validators.required],
    });

    this.selectedStorage = JSON.parse(localStorage.getItem('selectedStorage'));
    this.route.params.subscribe(params => {
        this.selectedWeekItem = params['id'];
    });
    this.route.params.subscribe(params => {
      this.costOf = params['cost_of'];
      console.log("costOf:" + this.costOf);
    });

    this.getWeeks();
    this.loadInvoicesTableHeaders();
    this.loadHeaders();
  }

  onRowNoteSelect(event) {
    //console.log(event.data.id);
    this.noteDelete = event.data.id;
  }

  onRowNoteUnselect(event)
  {
     this.noteDelete = '';
  }

  deleteNote()
  {
    if(this.noteDelete=='')
      this.messageToastService.sendMessage('error','Note Message','Select one note by delete !');
    else
    {
       this.confirm();
    }
     
      
  }

  confirm() {
    this.confirmationService.confirm({
        message: 'Are you sure that you want to delete the note ?',
        accept: () => {
          this.weekPanelService.deleteNote(this.noteDelete).subscribe((response: any) =>{
            this.messageToastService.sendMessage('success','Note Message','One note was deleted !');
            this.getNotes();
          });
        }
    });
  }

  loadHeaders(){
    this.cols = [
      { field: 'id', header: 'asd' },
      { field: 'text', header: 'asdsa' },
    ];
  }

  receiveYearQuarter($event){
    this.yearQuarter = $event;
    this.yearSelected = this.yearQuarter.year;
    this.getWeekDataFromServer();
  }
  receiveStorage(storage){
    this.selectedStorage = storage;
    this.getWeekDataFromServer();
  }

  calcDailyTotal = function () {
    this.dailyRevenueTotal =
        parseFloat(this.monday.amt) +
        parseFloat(this.tuesday.amt) +
        parseFloat(this.wednesday.amt) +
        parseFloat(this.thursday.amt) +
        parseFloat(this.friday.amt) +
        parseFloat(this.saturday.amt) +
        parseFloat(this.sunday.amt);
    return this.dailyRevenueTotal;
  }

  getSevenDays = function () {
     console.log(this.selectedStorage)
    this.weekPanelService.getSevenDays(this.selectedStorage.id,this.selectedWeekItem).subscribe((response: any) =>{
        let seven_d_w = response.seven_days_week;
        // console.log(seven_d_w);
        if (Array.isArray(seven_d_w) && seven_d_w.length > 0) {
          this.monday = {
            'id': seven_d_w[0].id,
            'amt_formatted': '$' + this.formatMoney(seven_d_w[0].total),
            'amt': parseFloat(seven_d_w[0].total),
            'dates_dim_date': seven_d_w[0].dates_dim_date,
            'merchandise':seven_d_w[0].merchandise,
            'wire':seven_d_w[0].wire,
            'delivery':seven_d_w[0].delivery,
          };
          this.tuesday = {
            'id': seven_d_w[1].id,
            'amt_formatted': '$' + this.formatMoney(seven_d_w[1].total),
            'amt': parseFloat(seven_d_w[1].total),
            'dates_dim_date': seven_d_w[1].dates_dim_date,
            'merchandise':seven_d_w[1].merchandise,
            'wire':seven_d_w[1].wire,
            'delivery':seven_d_w[1].delivery,
          };
          this.wednesday = {
            'id': seven_d_w[2].id,
            'amt_formatted': '$' + this.formatMoney(seven_d_w[2].total),
            'amt': parseFloat(seven_d_w[2].total),
            'dates_dim_date': seven_d_w[2].dates_dim_date,
            'merchandise':seven_d_w[2].merchandise,
            'wire':seven_d_w[2].wire,
            'delivery':seven_d_w[2].delivery,
          };
          this.thursday = {
            'id': seven_d_w[3].id,
            'amt_formatted': '$' + this.formatMoney(seven_d_w[3].total),
            'amt': parseFloat(seven_d_w[3].total),
            'dates_dim_date': seven_d_w[3].dates_dim_date,
            'merchandise':seven_d_w[3].merchandise,
            'wire':seven_d_w[3].wire,
            'delivery':seven_d_w[3].delivery,
          };
          this.friday = {
            'id': seven_d_w[4].id,
            'amt_formatted': '$' + this.formatMoney(seven_d_w[4].total),
            'amt': parseFloat(seven_d_w[4].total),
            'dates_dim_date': seven_d_w[4].dates_dim_date,
            'merchandise':seven_d_w[4].merchandise,
            'wire':seven_d_w[4].wire,
            'delivery':seven_d_w[4].delivery,
          };
          this.saturday = {
            'id': seven_d_w[5].id,
            'amt_formatted': '$' + this.formatMoney(seven_d_w[5].total),
            'amt': parseFloat(seven_d_w[5].total),
            'dates_dim_date': seven_d_w[5].dates_dim_date,
            'merchandise':seven_d_w[5].merchandise,
            'wire':seven_d_w[5].wire,
            'delivery':seven_d_w[5].delivery,
          };
          this.sunday = {
            'id': seven_d_w[6].id,
            'amt_formatted': '$' + this.formatMoney(seven_d_w[6].total),
            'amt': parseFloat(seven_d_w[6].total),
            'dates_dim_date': seven_d_w[6].dates_dim_date,
            'merchandise':seven_d_w[6].merchandise,
            'wire':seven_d_w[6].wire,
            'delivery':seven_d_w[6].delivery,
          };
          this.calcDailyTotal();
         // this.saveDays_btnDisable = false;
        } else {
          this.clearSevenDays();
        }
    })
  }

  getWeeks = function () {
      this.weekPanelService.getWeeks(this.yearQuarter.year).subscribe((response: any) =>{
      this.weekList = response.weeks;
      this.getWeekDataFromServer();
    });
  }

  getInvoices = function(){
      this.weekPanelService.getInvoices(this.costOf,this.selectedStorage.id,this.selectedWeekItem).subscribe((response: any) =>{
        this.invoices = response.invoices;
        this.calcInvoiceTotal();
      });
  }

  getNotes = function(){
    this.weekPanelService.getNotes(this.selectedStorage.id,this.selectedWeekItem,this.yearSelected).subscribe((response: any) =>{
      this.notesYearSelected = response.result.noteYearSelected;
      this.oldNotes = response.result.oldNotes;
      console.log('oldNotes '+this.oldNotes);
    });
  }

  calcInvoiceTotal = function () {
    this.invoiceTotal = 0.00;
    for (var i = 0; i < this.invoices.length; i++) {
      this.invoiceTotal += parseFloat(this.invoices[i].total);
    }
    return this.invoiceTotal;
  }

  formatMoney(amount, decimalCount = 2, decimal = ".", thousands = ",") {
    try {
      decimalCount = Math.abs(decimalCount);
      decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

      const negativeSign = amount < 0 ? "-" : "";

      let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
      let j = (i.length > 3) ? i.length % 3 : 0;

      return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - (+i)).toFixed(decimalCount).slice(2) : "");
    } catch (e) {
      console.log(e)
    }
  }

  clearSevenDays = function () {
    this.monday = {'id': -1, 'amt': 0.00};
    this.tuesday = {'id': -1, 'amt': 0.00};
    this.wednesday = {'id': -1, 'amt': 0.00};
    this.thursday = {'id': -1, 'amt': 0.00};
    this.friday = {'id': -1, 'amt': 0.00};
    this.saturday = {'id': -1, 'amt': 0.00};
    this.sunday = {'id': -1, 'amt': 0.00};
    this.dailyRevenueTotal = 0.00;
   // this.saveDays_btnDisable = true;
  }

  getWeekDataFromServer() {
    this.getSevenDays();
    this.getProjWeeklyRev();
    this.getInvoices();
    this.getTarget();
    this.getNotes();
    // this.calcCostDifference();
    // this.getNotes();
  }

  loadInvoicesTableHeaders(){
    this.invoicesTableCols = [
      { field: 'invoice_name', header: 'Invoice Name' },
      { field: 'invoice_number', header: 'Invoice Number' },
      { field: 'total', header: 'Total' },
      { field: 'actions', header: 'Actions' }
    ];
  }

  createInvoice = function () {
    this.weekPanelService.createInvoice(this.costOf, this.invoiceNumber_add,this.invoiceName_add,
        this.invoiceTotal_add,this.selectedStorage.id,this.selectedWeekItem)
        .pipe(first())
        .subscribe(
            data => {
              //console.log(data);
              // this.loading = false;
              // this.success = 'Store added succefull !';
              // this.clean();
              //this.router.navigate([this.returnUrl]);
              this.getInvoices();
              this.calcInvoiceTotal();
            },
            error => {
              console.log(error)
              // this.error = error;
              // this.loading = false;
            });
  }

  getProjWeeklyRev = function () {
    this.weekPanelService.getProjWeeklyRev(this.selectedStorage.id,this.selectedWeekItem).subscribe((response: any) =>{
      this.projWeeklyRev = response.proj_weekly_rev;
    });
  }
  getTarget = function () {
    this.weekPanelService.getTarget(this.costOf).subscribe((response: any) =>{

      this.target = (this.costOf == 'fresh') ? response['target_cof'] : ((this.costOf == 'goods') ? response['target_cog'] : 0.00) ;
    });
  }

  getTargetInMoney = function () {
    return this.calcDailyTotal() * (this.target / 100);
  }

  showEditDay(title:string) {
    this.title = title;
    if(title=='Monday')
    {
        this.dialogValues.id = this.monday.id;
        this.dialogValues.merchandise = this.monday.merchandise;
        this.dialogValues.wire = this.monday.wire;
        this.dialogValues.delivery = this.monday.delivery;
    }
    else if(title=='Tuesday')
    {
        this.dialogValues.id = this.tuesday.id;
        this.dialogValues.merchandise = this.tuesday.merchandise;
        this.dialogValues.wire = this.tuesday.wire;
        this.dialogValues.delivery = this.tuesday.delivery;
    }
    else if(title=='Wednesday')
    {
        this.dialogValues.id = this.wednesday.id;
        this.dialogValues.merchandise = this.wednesday.merchandise;
        this.dialogValues.wire = this.wednesday.wire;
        this.dialogValues.delivery = this.wednesday.delivery;
    }
    else if(title=='Thursday')
    {
        this.dialogValues.id = this.thursday.id;
        this.dialogValues.merchandise = this.thursday.merchandise;
        this.dialogValues.wire = this.thursday.wire;
        this.dialogValues.delivery = this.thursday.delivery;
    }
    else if(title=='Friday')
    {
        this.dialogValues.id = this.friday.id;
        this.dialogValues.merchandise = this.friday.merchandise;
        this.dialogValues.wire = this.friday.wire;
        this.dialogValues.delivery = this.friday.delivery;
    }
    else if(title=='Saturday')
    {
        this.dialogValues.id = this.saturday.id;
        this.dialogValues.merchandise = this.saturday.merchandise;
        this.dialogValues.wire = this.saturday.wire;
        this.dialogValues.delivery = this.saturday.delivery;
    }
    else if(title=='Sunday')
    {
        this.dialogValues.id = this.sunday.id;
        this.dialogValues.merchandise = this.sunday.merchandise;
        this.dialogValues.wire = this.sunday.wire;
        this.dialogValues.delivery = this.sunday.delivery;
    }
    this.visible = true;
  }

  get f() { return this.dayform.controls; }

  get n() { return this.noteform.controls; }

  updateDay(){
    this.submitted = true;

    
    if (this.dayform.invalid) {
      //this.loading = false;
      return;
    }
    this.error = '';
    
    this.weekPanelService.updateDay(this.f.id.value, this.f.merchandise.value, this.f.wire.value,
        this.f.delivery.value)
        .pipe(first())
        .subscribe(
            data => {
              //console.log(data);
              this.getSevenDays();
              this.visible = false;
              //this.router.navigate([this.returnUrl]);
            },
            error => {
              this.visible = false;
              console.log(error)
              /*this.error = error;
              this.loading = false;*/
            });
  }

  createNote(){
    this.submittedFormNote = true;

    
    if (this.noteform.invalid) {
      //this.loading = false;
      return;
    }
    
    
    this.weekPanelService.createNote(this.selectedStorage.id,this.selectedWeekItem,this.yearSelected,this.n.text.value)
        .pipe(first())
        .subscribe(
            data => {
              //console.log(data);
              this.getNotes();
              this.visibleDialogNote = false;
              //this.router.navigate([this.returnUrl]);
            },
            error => {
              this.visibleDialogNote = false;
              console.log(error)
              /*this.error = error;
              this.loading = false;*/
        });
  }

}
