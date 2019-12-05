import { Component } from '@angular/core';
import { first } from 'rxjs/operators';
import {PlanService} from '../_services'

import { User } from '@app/_models';
import { UserService, AuthenticationService } from '@app/_services';

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


    modules: any;

    constructor(private userService: UserService, private planService:PlanService, private authenticationService: AuthenticationService) {
            this.lineChartData = {
                labels:['January','February','March','April', 'May', 'June', 'July'],
                datasets:[
                    {
                        label:'My First dataset',
                        backgroundColor: '#42A5F5',
                        borderColor: '#1E88E5',
                        data: [65,59,80,81,56,55,40]

                    },
                    {
                        label:'My Second dataset',
                        backgroundColor: '#9CCC65',
                        borderColor: '#7CB342',
                        data: [28, 48, 40, 19, 86, 27, 90]

                    }
                ]
            };

            this.pieChartData = {
                labels:['A','B','C'],
                datasets:[
                    {
                        backgroundColor: ['#FF6384','#36A2EB','#FFCE56'],
                        data: [300,50,100],
                        hoverBackgroundColor: ['#FF6384','#36A2EB','#FFCE56'],
                    }
                ]
            };
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
}