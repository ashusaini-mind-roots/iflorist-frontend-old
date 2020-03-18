import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {retry, catchError} from 'rxjs/operators';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WorkmancombService {

  constructor(
      private http: HttpClient
  ) { }

  getWorkmancombList(): Observable<any> {
     return this.http.get(`${environment.apiUrl}/work_man_comp/all`);
  }
}
