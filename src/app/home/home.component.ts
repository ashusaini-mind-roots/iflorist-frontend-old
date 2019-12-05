import { Component } from '@angular/core';
import { first } from 'rxjs/operators';
import {PlanService} from '../_services'

import { User } from '@app/_models';
import { UserService, AuthenticationService } from '@app/_services';
import {UtilsService} from "../_services/utils.service";

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent {
    loading = false;
    users: User[];
    plans:any;
    loaded:boolean = true;
    error: boolean;
    plan_cost:string = '';
    lineChartData : any;
    pieChartData : any;
    yearQuarter: any;
    yearIndexSelected:number;


    modules: any;

    constructor(private userService: UserService,
                private utilService: UtilsService,
                private planService:PlanService,
                private authenticationService: AuthenticationService) {
            this.lineChartData = {
                labels:['January','February','March','April', 'May', 'June', 'July'],
                datasets:[
                    {
                        label:'My First dataset',
                        backgroundColor: '#ff596e',
                        borderColor: '#ff596e',
                        data: [65,59,80,81,56,55,40]

                    },
                    {
                        label:'My Second dataset',
                        backgroundColor: '#1caba0',
                        borderColor: '#1caba0',
                        data: [28, 48, 40, 19, 86, 27, 90]

                    }
                ]
            };

            // this.pieChartData = {
            //     labels:['A','B','C'],
            //     datasets:[
            //         {
            //             backgroundColor: ['#FF6384','#36A2EB','#FFCE56'],
            //             data: [300,50,100],
            //             hoverBackgroundColor: ['#FF6384','#36A2EB','#FFCE56'],
            //         }
            //     ]
            // };

        this.yearQuarter = {year : this.utilService.GetCurrentYear(), quarter: 1};
    }

    ngOnInit() {
        /*this.loading = true;
        this.userService.getAll().pipe(first()).subscribe(users => {
            this.loading = false;
            this.users = users;
        });*/
        //this.loadPlans();
    }

    loadPlans(){
        const currentUser = this.authenticationService.currentUserValue;
        console.log(currentUser.user.id);
        return this.planService.getByUser(currentUser.user.id).subscribe((data: any) =>{
            this.modules = data.plans;
            console.log(data.plans);
            this.loaded = false;
        })
    }

    receiveYearQuarter($event){
        this.yearQuarter = $event;
        // this.reloadData();
        // console.log(this.yearQuarter);
        // console.log(this.selectedStorage);
    }
    //
    // receiveYearQuarter($event){
    //     this.yearQuarter = $event;
    //     this.yearIndexSelected = this.yearQuarter.year;
    //     console.log(this.yearIndexSelected);
    //     // this.yearIndexSelected = yearIndexSelected;
    //     //this.loadHeaders();
    //     //this.loadProjection();
    //     // this.getWeekDataFromServer();
    //   }
}