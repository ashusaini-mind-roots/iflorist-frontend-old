import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from './_services';
import { User } from './_models';

declare var $: any;
/*declare var jquery: any*/

@Component({ selector: 'app', templateUrl: 'app.component.html' })
export class AppComponent implements OnInit{
    currentUser: User;
    toggled: boolean = false;

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