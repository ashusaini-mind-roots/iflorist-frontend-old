import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import {PlanService} from '../_services'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register-plan-data',
  templateUrl: './register-plan-data.component.html',
  styleUrls: ['./register-plan-data.component.less']
})

export class RegisterPlanDataComponent implements OnInit {

  private sub: any;
  private name:string;
  private password:string;
  private email:string;
  private id_plans: Array<string> = [];
  plans:any;
  loaded:boolean = true;
  error: boolean;
  plan_cost:string = '';

  constructor(private activateRoute: ActivatedRoute, private planService:PlanService, private router: Router) { }

  ngOnInit() {
    this.sub = this.activateRoute.params.subscribe(params=>{
        this.name = params.name;
        this.password = params.password;
        this.email = params.email;
    });
    console.log(this.password);
    this.loaded = true;
    this.loadPlans();
  }

  loadPlans(){
    return this.planService.getAll().subscribe((data: any) =>{
        this.plans = data.plans;
        console.log(data.plans);
        this.loaded = false;
    })
  }

  next(){

    if(this.plan_cost!='')
    {
       this.id_plans.push(this.plan_cost);
    }

    if(this.id_plans.length==0 || this.plan_cost=='')
    {
        this.error = true;
        console.log(this.id_plans.length);
        return;
    }

    this.router.navigate(['register-cc-data', { name: this.name, password: this.password, email: this.email, id_plans: this.id_plans }  ])
  }

  changePlansCost(id:string)
  {
      console.log(id);
      this.plan_cost = id;
  }

  changePlans(id:string, isChecked: boolean)
  {
    if(isChecked)
      this.id_plans.push(id);
    else
    {
      const index: number = this.id_plans.indexOf(id);
      if(index !== -1)
      {
        this.id_plans.splice(index,1);
      }
    }

    console.log(this.id_plans);
  }

}
