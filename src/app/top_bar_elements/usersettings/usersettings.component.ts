import { Component, OnInit } from '@angular/core';
import {MenuItem} from 'primeng/api';


@Component({
  selector: 'app-usersettings',
  templateUrl: './usersettings.component.html',
  styleUrls: ['./usersettings.component.less']
})
export class UsersettingsComponent implements OnInit {
	
  items: MenuItem[];	  

  constructor() { }

  ngOnInit() {
	  this.items = [
	  {
		  label:'File',
		  items:[
			  {
				  label: 'New',
				  icon: 'pi pi-fw pi-plus'
			  },
			  {
				  label: 'Open',
			  },
			  {
				  label: 'Quit',
				  
			  }
		  ]
	  }
	  ];
  }

}
