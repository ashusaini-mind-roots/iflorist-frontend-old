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
  
  bool_error: boolean = false;
  error: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private companyService: CompanyService,
    
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const data = {'activation_code':params['activation_code']};
      this.companyService.validateCompany(data).subscribe(res => {
        //this.store = res.store;
        if(res.error)
        {
            this.bool_error = true;
            this.error = res.error;
        }
      });
    });
  }

}
