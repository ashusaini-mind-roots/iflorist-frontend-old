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

    modules: any;

    constructor(private userService: UserService, private planService:PlanService, private authenticationService: AuthenticationService) { }

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