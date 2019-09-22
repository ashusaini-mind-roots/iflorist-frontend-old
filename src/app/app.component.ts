import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserService, AuthenticationService, PlanService } from './_services';
/*import {PlanService} from '../_services'*/
import { User } from './_models';

declare var $: any;
/*declare var jquery: any*/

@Component({ selector: 'app', templateUrl: 'app.component.html' })
export class AppComponent implements OnInit{
    currentUser: User;
    toggled: boolean = false;

    modules: any;

    ngOnInit() {
       /*$(document).ready(() => {
            $("#menu-toggle").click(function(e) {
                console.log('akiiii');
                e.preventDefault();
                $("#wrapper").toggleClass("toggled");
            });
        });*/

        /*(function ($){
            $(document).ready(function(e){
                console.log('akiiii');
                e.preventDefault();
                $("#wrapper").toggleClass("toggled");
            });
        })(jquery);*/
        this.loadModules();

    }

    loadModules(){
        const currentUser = this.authenticationService.currentUserValue;

        if(currentUser)
        {
            console.log(currentUser.user.id);
            return this.planService.getByUser(currentUser.user.id).subscribe((data: any) =>{
                this.modules = data.modules;
                console.log(data.modules);
            });
        }

      }

    loadComponents(component_id: string)
    {
        this.router.navigate([component_id]);
    }

    toggleMenu()
    {
        if(!this.toggled)
            this.toggled = true;
        else{
            this.toggled = false;
        }
    }

    constructor(
        private router: Router,
        private userService: UserService,
        private planService:PlanService,
        private authenticationService: AuthenticationService
    ) {
        this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    }

    logout() {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
    }

    /*cancelCompany()
    {

    }*/


}
