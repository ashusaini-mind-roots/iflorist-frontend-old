import { Component, OnInit } from '@angular/core';
import {MenuItem} from 'primeng/api';
import { UserService, AuthenticationService, EmployeeService } from '../../_services';
/*import {PlanService} from '../_services'*/
import { User,Role } from '../../_models';
import { CheckRole } from "../../_helpers/check-role";
import { Router } from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';

class ImageSnippet {
  pending: boolean = false;
  status: string = 'init';

  constructor(public src: string, public file: File) { }
}

@Component({
  selector: 'app-usersettings',
  templateUrl: './usersettings.component.html',
  styleUrls: ['./usersettings.component.less']
})
export class UsersettingsComponent implements OnInit {
	
  items: MenuItem[];
  selectedFile: ImageSnippet;
  userName:string = '';

  constructor(
    private userService: UserService,
	private authenticationService: AuthenticationService,
	private checkRole: CheckRole,
	private employeeService: EmployeeService,
	private router: Router,
	private domSanitizer: DomSanitizer
  ) {
	 this.selectedFile = new ImageSnippet('', null);
  }

  ngOnInit() {
	  this.loadUserImage();
	  this.items = [
            {
                label: '',
                icon: 'pi pi-fw pi-file',
                items: [{
                        label: 'New', 
                        icon: 'pi pi-fw pi-plus',
                        items: [
                            {label: 'Project'},
                            {label: 'Other'},
                        ]
                    },
                    {label: 'Open'},
                    {separator:true},
                    {label: 'Quit'}
                ]
            },
        ];
		
		const currentUser = this.authenticationService.currentUserValue;
		console.log(currentUser);
		this.userName = currentUser.user.name;
  }
  
  loadUserImage(){
		const currentUser = this.authenticationService.currentUserValue;
        if(currentUser)
        {
			if(this.checkRole.isStoreManager() || this.checkRole.isEmployee())
			{
				return this.employeeService.getImageEmployeeByUser(currentUser.user.id).subscribe((data: any) =>{

					const file: File = data;
				    const reader = new FileReader();
				    reader.addEventListener('load', (event: any) => {
					  this.selectedFile = new ImageSnippet(event.target.result, file);
					  console.log(this.selectedFile.file);
				    });
				    reader.readAsDataURL(file);
                });
			}
        }
	}
	
	logout() {
        this.router.navigate(['/login']);
		this.authenticationService.logout();
    }

}
