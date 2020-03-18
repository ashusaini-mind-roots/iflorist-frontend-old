import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import {PlanService} from '../_services'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {RouterService} from '../_services/router.service';

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

  constructor(private activateRoute: ActivatedRoute, private planService:PlanService, private router: Router,  private routerService: RouterService) { }

  ngOnInit() {
    document.body.classList.remove('bg-login-img');
    /*this.sub = this.activateRoute.params.subscribe(params=>{
        this.name = params.name;
        this.password = params.password;
        this.email = params.email;
    });*/
    if(this.routerService.getRouterData()!=undefined)
    {
        this.name = JSON.parse(this.routerService.getRouterData())[0].name;
        this.password = JSON.parse(this.routerService.getRouterData())[0].password;
        this.email = JSON.parse(this.routerService.getRouterData())[0].email;
        //this.routerService.setRouterData(undefined);
	}else
	{
		this.router.navigate(['register-general-data']);
	}
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

  keyDownFunction(event)
	{
		if(event.keyCode == 13)
		{
			this.next();
		}
	}
  
  next(){

    if(this.routerService.getRouterData()==undefined)
    {
      return;
    }

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

    type type = Array <{name:string,password:any,email:any,id_plans:any}>;
    const data: type = [
        {name:this.name,password:this.password,email:this.email,id_plans: this.id_plans}
    ];
    this.routerService.setRouterData(undefined);
    this.routerService.setRouterData(data);

    //this.router.navigate(['register-cc-data', { name: this.name, password: this.password, email: this.email, id_plans: this.id_plans }  ])
    this.router.navigate(['register-cc-data']);
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
