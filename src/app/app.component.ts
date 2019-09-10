import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from './_services';
import { User } from './_models';

declare var $: any;

@Component({ selector: 'app', templateUrl: 'app.component.html' })
export class AppComponent implements OnInit{
    currentUser: User;

    ngOnInit() {
        $(document).ready(() => {
            $("#menu-toggle").click(function(e) {
                console.log('akiiii');
                e.preventDefault();
                $("#wrapper").toggleClass("toggled");
            });
        });
        
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