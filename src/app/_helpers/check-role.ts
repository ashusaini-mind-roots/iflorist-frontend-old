import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../_models/User';
import { Role } from '../_models/Role';

import { AuthenticationService } from '@app/_services';

@Injectable()
export class CheckRole {
	
	currentUser: User;
	
    constructor(private authenticationService: AuthenticationService) {
		this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
	}
	
	isCompanyAdmin():boolean {
        if(this.currentUser)
		{
			let roles = this.currentUser.roles;
			let result = false;
			roles.forEach(function(value){
				if(value.name == Role.COMPANYADMIN)
				{
					result = true;
				}
			});
			
			return result;
		}
		return false;
	}
	
	isRoot():boolean {
        if(this.currentUser)
		{
			let roles = this.currentUser.roles;
			let result = false;
			roles.forEach(function(value){
				if(value.name == Role.ROOT)
				{
					result = true;
				}
			});
			
			return result;
		}
		return false;
	}
	
	isStoreManager():boolean {
        if(this.currentUser)
		{
			let roles = this.currentUser.roles;
			let result = false;
			roles.forEach(function(value){
				if(value.name == Role.STOREMANAGER)
				{
					result = true;
				}
			});
			
			return result;
		}
		return false;
	}
	
	isEmployee():boolean {
        if(this.currentUser)
		{
			let roles = this.currentUser.roles;
			let result = false;
			roles.forEach(function(value){
				if(value.name == Role.EMPLOYEE)
				{
					result = true;
				}
			});
			
			return result;
		}
		return false;
	}
	
	/*get isAcces() {
        if(this.currentUser)
		{
			let roles = this.currentUser.roles;
			let result = false;
			roles.forEach(function(value){
				if(value.name == Role.COMPANYADMIN || value.name == Role.ROOT || value.name == Role.STOREMANAGER)
				{
					result = true;
				}
			});
			
			return result;
		}
		return false;
	}*/
	
}