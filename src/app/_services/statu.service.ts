import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {retry, catchError} from 'rxjs/operators';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StatuService {

  constructor(
      private http: HttpClient
  ) { }

  getStatuList(): Observable<any> {
     return this.http.get(`${environment.apiUrl}/statu/all`);
  }


}
