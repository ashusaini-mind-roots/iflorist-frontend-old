import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {retry, catchError} from 'rxjs/operators';

import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })
export class RouterService {
    constructor() { }

    private router_data: any = undefined;

    public getRouterData()
    {
		this.router_data = localStorage.getItem('registerData');
		//console.log(this.router_data);
		return this.router_data;
    }

    public setRouterData(data:any)
    {
		localStorage.setItem('registerData', JSON.stringify(data));
		this.router_data = localStorage.getItem('registerData');
		//console.log()
        return this.router_data;
    }

    
}