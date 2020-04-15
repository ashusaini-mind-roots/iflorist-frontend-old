import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserService, AuthenticationService, PlanService, CompanyService } from './_services';
/*import {PlanService} from '../_services'*/
import { User,Role } from './_models';
import { CheckRole } from "./_helpers/check-role";

declare var $: any;
/*declare var jquery: any*/

@Component({ selector: 'app', templateUrl: 'app.component.html',providers: [CheckRole]})
export class AppComponent implements OnInit{
    currentUser: User;
    toggled: boolean = false;

    modules: any;
    stores:any;
	companyName:string = '';
	varr:boolean = true;
	

    ngOnInit() {
		this.loadModules();
        this.loadStores();
	}

    loadModules(){
        const currentUser = this.authenticationService.currentUserValue;
        if(currentUser)
        {
            return this.planService.getByUser(currentUser.user.id).subscribe((data: any) =>{
                this.modules = data.modules;
            });
        }
    }

    loadStores(){
        const currentUser = this.authenticationService.currentUserValue;
		if(currentUser)
        {
			this.companyName = currentUser.company.name;
            return this.companyService.storesByCompany().subscribe((data: any) =>{
                this.stores = data.stores;
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
        private companyService:CompanyService,
        private authenticationService: AuthenticationService,
		private checkRole: CheckRole,
    ) {
        this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
	}

    logout() {
        
        this.router.navigate(['/login']);
		this.authenticationService.logout();
    }
	
	get hasAcces() {
    	if(this.checkRole.isRoot() || this.checkRole.isCompanyAdmin() || this.checkRole.isStoreManager())
		  return true;
		else return false;
	}
	
	get editCompanyEmployee()
	{
		if(this.checkRole.isRoot() || this.checkRole.isCompanyAdmin())
		  return true;
		else return false;
	}
	
	get editAppUser()
	{
		if(this.checkRole.isRoot() || this.checkRole.isCompanyAdmin() || this.checkRole.isStoreManager() || this.checkRole.isAppUser())
		  return true;
		else return false;
	}
	
	isStoreSubmenu()
	{
		let url = this.router.url;
		if(url.includes('store') || url.includes('storeedit') || url.includes('storecreate'))
		{
			return true;
		}
		return false;
	}
	
	isEmployeeSubmenu()
	{
		let url = this.router.url;
		if(url.includes('employees') || url.includes('edit-employee') || url.includes('create-employee'))
		{
			return true;
		}
		return false;
	}
	
	isCompanyEmployeeSubmenu()
	{
		let url = this.router.url;
		if(url.includes('companyemployee-list') || url.includes('create-companyemployee') || url.includes('edit-companyemployee'))
		{
			return true;
		}
		return false;
	}
	
	isAppUserSubmenu()
	{
		let url = this.router.url;
		if(url.includes('app-users') || url.includes('app-user-create') || url.includes('app-user-edit'))
		{
			return true;
		}
		return false;
	}
	
	isSettingsActive()
	{
		let url = this.router.url;
		if(this.router.isActive('stores',true)  || this.router.isActive('employees',true) || this.router.isActive('companyemployee-list',true) || this.router.isActive('app-users',true))
		{
			
			return true;
		}
		else if(url.includes('storeedit') || url.includes('store') || url.includes('storecreate') || url.includes('employees')|| url.includes('create-employee') || url.includes('edit-employee')
			|| url.includes('companyemployee-list') || url.includes('create-companyemployee') || url.includes('edit-companyemployee') || url.includes('app-users') || url.includes('app-user-create') || url.includes('app-user-edit'))
		{
			return true;
		}
		else 
			return false;
	}

}
