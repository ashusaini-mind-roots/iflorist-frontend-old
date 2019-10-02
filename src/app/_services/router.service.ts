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
        return this.router_data;
    }

    public setRouterData(data:any)
    {
        return this.router_data = data;
    }

    
}