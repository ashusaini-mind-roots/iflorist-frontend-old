import { Component } from '@angular/core';
import { first } from 'rxjs/operators';
import {PlanService} from '../_services'
import { SalesService } from "../_services/sales.service";

import { User } from '@app/_models';
import { UserService, AuthenticationService } from '@app/_services';
import {UtilsService} from "../_services/utils.service";
import {StoreSubscriberService} from "@app/_services/storeSubscriber.service";
import {CostOfFreshService} from "@app/_services/costOfFresh.service";
import {SchedulerService} from "@app/_services/scheduler.service";

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent {
    loading = false;
    plans:any;
    loaded:boolean = true;
    error: boolean;
    yearQuarter: any;
    selectedStorage: any;

    //sales section
    salesChart : any;
    projWeeklyRevQuarter: number;
    weeks: any[];
    actualSalesTotal: number;
    actualSalesByWeek: number[];
    projectedSalesByWeek: number[];

    //cost of hard goods section
    cogChart: any;
    actualCogByWeek: number[];
    projectedCogByWeek: number[];
    actualCogTotal: number;
    projectionsCog: number;
    weeksCog: any[];

    //cost of fresh section
    cofChart: any;
    actualCofByWeek: number[];
    projectedCofByWeek: number[];
    actualCofTotal: number;
    projectionsCof: number;
    weeksCof: any[];

    //cost of labor section
    colChart: any;
    actualColByWeek: number[];
    projectedColByWeek: number[];
    actualColTotal: number;
    projectionsCol: number;
    weeksCol: any[];

    modules: any;

    constructor(
        private storeSubscriberService: StoreSubscriberService,//service used to receive store from top bar stores combobox
        private userService: UserService,
        private utilService: UtilsService,
        private planService:PlanService,
        private authenticationService: AuthenticationService,
        private salesService: SalesService,
        private costOfFreshService: CostOfFreshService,
        private schedulerService: SchedulerService,
    ) {
        storeSubscriberService.subscribe(this,function (ref,store) {
            ref.receiveStorage(store);
        });
        this.yearQuarter = {year : this.utilService.GetCurrentYear(), quarter: 1};

        //sales
        this.projWeeklyRevQuarter = 0.00;
        this.actualSalesTotal = 0.00;
        this.actualSalesByWeek = new Array();
        this.projectedSalesByWeek = new Array();

        //Cog
        this.projectionsCog = 0.00;
        this.actualCogTotal = 0.00;
        this.actualCogByWeek = new Array();
        this.projectedCogByWeek = new Array();

        //Cof
        this.projectionsCof = 0.00;
        this.actualCofTotal = 0.00;
        this.actualCofByWeek = new Array();
        this.projectedCofByWeek = new Array();

        //Col
        this.projectionsCol = 0.00;
        this.actualColTotal = 0.00;
        this.actualColByWeek = new Array();
        this.projectedColByWeek = new Array();

    }

    ngOnInit() {
        this.selectedStorage = JSON.parse(localStorage.getItem('selectedStorage'));

    }

    initActualSalesByWeekArray(){
        this.actualSalesByWeek = [0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00];
        this.projectedSalesByWeek = [0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00];
    }
    initGogArray(){
        this.actualCogByWeek = [0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00];
        this.projectedCogByWeek = [0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00];
    }
    initGofArray(){
        this.actualCofByWeek = [0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00];
        this.projectedCofByWeek = [0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00];
    }
    initColArray(){
        this.actualColByWeek = [0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00];
        this.projectedColByWeek = [0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00];
    }
    showSalesChart()
    {
        this.salesChart = {
            labels:['1','2','3','4', '5', '6', '7', '8','9', '10', '11', '12', '13'],
            datasets:[
                {
                    label:'Actual',
                    backgroundColor: '#1caba0',
                    borderColor: '#1caba0',
                    data: this.actualSalesByWeek
                },
                {
                    label:'Projected',
                    backgroundColor: '#ff596e',
                    borderColor: '#ff596e',
                    data: this.projectedSalesByWeek
                }
            ]
        };
    }

    showCogChart()
    {
        this.cogChart = {
            labels:['1','2','3','4', '5', '6', '7', '8','9', '10', '11', '12', '13'],
            datasets:[
                {
                    label:'Actual',
                    backgroundColor: '#1caba0',
                    borderColor: '#1caba0',
                    data: this.actualCogByWeek
                },
                {
                    label:'Projected',
                    backgroundColor: '#ff596e',
                    borderColor: '#ff596e',
                    data: this.projectedCogByWeek
                }
            ]
        };
    }
    showCofChart()
    {
        this.cofChart = {
            labels:['1','2','3','4', '5', '6', '7', '8','9', '10', '11', '12', '13'],
            datasets:[
                {
                    label:'Actual',
                    backgroundColor: '#1caba0',
                    borderColor: '#1caba0',
                    data: this.actualCofByWeek
                },
                {
                    label:'Projected',
                    backgroundColor: '#ff596e',
                    borderColor: '#ff596e',
                    data: this.projectedCofByWeek
                }
            ]
        };
    }

    showColChart()
    {
        this.colChart = {
            labels:['1','2','3','4', '5', '6', '7', '8','9', '10', '11', '12', '13'],
            datasets:[
                {
                    label:'Actual',
                    backgroundColor: '#1caba0',
                    borderColor: '#1caba0',
                    data: this.actualColByWeek
                },
                {
                    label:'Projected',
                    backgroundColor: '#ff596e',
                    borderColor: '#ff596e',
                    data: this.projectedColByWeek
                }
            ]
        };
    }

    receiveYearQuarter($event){
        this.yearQuarter = $event;
        this.getSales();
        this.getCog();
        this.getCof();
      //  this.getCol();
        // this.reloadData();
        console.log(this.yearQuarter)
    }
    receiveStorage(storage){
        this.selectedStorage = storage;
        console.log(this.selectedStorage)
        this.getSales();
        this.getCog();
        this.getCof();
        //this.getCol();
    }

    getSales()
    {
        //get sales list
        this.loading = true;
        // console.log(this.selectedStorage.id + " -- " + this.yearQuarter.quarter)
        this.salesService.getSales(this.selectedStorage.id,this.yearQuarter.year,this.yearQuarter.quarter).subscribe((response: any) =>{
            this.weeks = response.weeks;
            this.calcActualSalesTotal();
            this.getProjectedSales();
            // this.loading = false;
        });
        // this.loading = false;
    }
    getCog(){
        this.loading = true;
        // console.log(this.selectedStorage.id + " -- " + this.yearQuarter.quarter)
        this.costOfFreshService.getMasterOverviewWeekly('goods',this.selectedStorage.id,this.yearQuarter.year,this.yearQuarter.quarter).subscribe((data: any) =>{
            this.weeksCog = data.master_overview_weekly;
            // if(this.weeksCog.length > 0)
            // {
                console.log(this.weeksCog);
                this.calcActualCogTotal();
                this.showCogChart();
            //}

        })
    }
    getCof(){
        this.loading = true;
        // console.log(this.selectedStorage.id + " -- " + this.yearQuarter.quarter)
        this.costOfFreshService.getMasterOverviewWeekly('fresh',this.selectedStorage.id,this.yearQuarter.year,this.yearQuarter.quarter).subscribe((data: any) =>{
            this.weeksCof = data.master_overview_weekly;
            //if(this.weeksCof.length > 0) {
                this.calcActualCofTotal();
                this.showCofChart();
                this.getCol();
        })
    }
    getCol(){
        this.loading = true;
        // console.log(this.selectedStorage.id + " -- " + this.yearQuarter.quarter)
        this.schedulerService.getScheduledPayrollByQuarter(this.yearQuarter.year,this.selectedStorage.id,this.yearQuarter.quarter).subscribe((data: any) =>{
            this.weeksCol = data.scheduled_payroll_array;
          //  if(this.weeksCol.length > 0) {
                this.calcActualColTotal();
                this.showColChart();
        })
    }
    /**
     * This function is just getProjWeeklyRevQuarter
     */
    getProjectedSales(){
        this.salesService.getProjWeeklyRevQuarter(this.selectedStorage.id,this.yearQuarter.year,this.yearQuarter.quarter).subscribe((response: any) =>{
            console.log(response);

            this.projWeeklyRevQuarter = response.proj_weekly_rev_quarter;
            this.projectedSalesByWeek = response.all_projected_sales;
            this.showSalesChart();
            // this.showLineChart();
        });
    }
    calcActualSalesTotal(){
        this.actualSalesTotal = 0.00;
        this.initActualSalesByWeekArray();
        for (let i = 0; i < this.weeks.length; i++) {
            let total = this.weeks[i].totalDelivery + this.weeks[i].totalWire + this.weeks[i].totalMerchandise;
            this.actualSalesTotal += total;
            this.actualSalesByWeek[(this.weeks[i].number - (13 * (this.yearQuarter.quarter - 1)))-1] = total;
        }
    }

    calcActualCogTotal(){
        this.actualCogTotal = this.projectionsCog = 0.00;
        this.initGogArray();
        for (let i = 0; i < this.weeksCog.length; i++) {
            let total = Number(this.weeksCog[i].weekly_cog_total);
            this.actualCogTotal += total;
            this.projectionsCog += Number(this.weeksCog[i].projected_weekly_revenue);
            this.actualCogByWeek[(this.weeksCog[i].week_number - (13 * (this.yearQuarter.quarter - 1)))-1] = total;
            this.projectedCogByWeek[(this.weeksCog[i].week_number - (13 * (this.yearQuarter.quarter - 1)))-1] = Number(this.weeksCog[i].projected_weekly_revenue);
        }
        // console.log(this.projectedCogByWeek);
    }
    calcActualCofTotal(){
        this.actualCofTotal = this.projectionsCof = 0.00;
        this.initGofArray();
        for (let i = 0; i < this.weeksCof.length; i++) {
            let total = Number(this.weeksCof[i].weekly_cog_total);
            this.actualCofTotal += total;
            this.projectionsCof += Number(this.weeksCof[i].projected_weekly_revenue);
            this.actualCofByWeek[(this.weeksCof[i].week_number - (13 * (this.yearQuarter.quarter - 1)))-1] = total;
            this.projectedCofByWeek[(this.weeksCof[i].week_number - (13 * (this.yearQuarter.quarter - 1)))-1] = Number(this.weeksCof[i].projected_weekly_revenue);
        }
    }

    calcActualColTotal(){
        this.actualColTotal = this.projectionsCol = 0.00;
        this.initColArray();
        for (let i = 0; i < this.weeksCol.length; i++) {
            let total = Number(this.weeksCol[i].scheduled_payroll);
            console.log(this.weeksCol[i])
            this.actualColTotal += total;
            this.actualColByWeek[(this.weeksCol[i].week_number - (13 * (this.yearQuarter.quarter - 1)))-1] = total;
        }
        this.projectionsCol = this.projectionsCof;
        this.projectedColByWeek = this.projectedCofByWeek;
    }

}
