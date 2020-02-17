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
            /*{
                label: 'Edit',
                icon: 'pi pi-fw pi-pencil',
                items: [
                    {label: 'Delete', icon: 'pi pi-fw pi-trash'},
                    {label: 'Refresh', icon: 'pi pi-fw pi-refresh'}
                ]
            },
            {
                label: 'Help',
                icon: 'pi pi-fw pi-question',
                items: [
                    {
                        label: 'Contents'
                    },
                    {
                        label: 'Search', 
                        icon: 'pi pi-fw pi-search', 
                        items: [
                            {
                                label: 'Text', 
                                items: [
                                    {
                                        label: 'Workspace'
                                    }
                                ]
                            },
                            {
                                label: 'File'
                            }
                    ]}
                ]
            },
            {
                label: 'Actions',
                icon: 'pi pi-fw pi-cog',
                items: [
                    {
                        label: 'Edit',
                        icon: 'pi pi-fw pi-pencil',
                        items: [
                            {label: 'Save', icon: 'pi pi-fw pi-save'},
                            {label: 'Update', icon: 'pi pi-fw pi-save'},
                        ]
                    },
                    {
                        label: 'Other',
                        icon: 'pi pi-fw pi-tags',
                        items: [
                            {label: 'Delete', icon: 'pi pi-fw pi-minus'}
                        ]
                    }
                ]
            },
            {separator:true},
            {
                label: 'Quit', icon: 'pi pi-fw pi-times'
            }*/
        ];
		
		const currentUser = this.authenticationService.currentUserValue;
		console.log(currentUser);
		this.userName = currentUser.user.name;
  }
  
  loadUserImage(){
		const currentUser = this.authenticationService.currentUserValue;
        if(currentUser)
        {
            //console.log(currentUser.user.id);
			if(this.checkRole.isStoreManager() || this.checkRole.isEmployee())
			{
				return this.employeeService.getImageEmployeeByUser(currentUser.user.id).subscribe((data: any) =>{
					console.log(data);
					
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
