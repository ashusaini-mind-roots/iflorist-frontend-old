import { Component, OnInit } from '@angular/core';
import {CompanyService} from '../_services/company.service'
import {Observable, throwError} from 'rxjs';
import {retry, catchError} from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-activate-company',
  templateUrl: './activate-company.component.html',
  styleUrls: ['./activate-company.component.less']
})
export class ActivateCompanyComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private companyService: CompanyService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const data = {'company_id':params['id']};
      this.companyService.validateCompany(data).subscribe(res => {
        //this.store = res.store;
        console.log(res);
      });
    });
  }

}
