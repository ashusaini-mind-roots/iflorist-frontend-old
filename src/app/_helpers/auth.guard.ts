import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from '@app/_services';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this.authenticationService.currentUserValue;
        if (currentUser) {
			console.log(route.data.roles);
			let roles = currentUser.roles;
			let result = false;
			roles.forEach(function(value){
				if (route.data.roles && route.data.roles.indexOf(value.name) != -1)
				{
					result = true;
				}
			});
			if(result)
				return true;
            
			this.router.navigate(['/home']);
			//this.router.navigate(['/login']);
			return false;
        }
		
		// not logged in so redirect to login page with the return url
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}