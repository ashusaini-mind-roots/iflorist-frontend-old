import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { AuthGuard } from './_helpers';
import { StoreListComponent } from './storecrud/store-list/store-list.component';
import { CreateStoreComponent } from './storecrud/create-store/create-store.component';
import { EditStoreComponent} from "./storecrud/edit-store/edit-store.component";

import {RegisterGeneralDataComponent} from './register-general-data/register-general-data.component';
import {RegisterPlanDataComponent} from './register-plan-data/register-plan-data.component';
import {RegisterCcDataComponent} from './register-cc-data/register-cc-data.component';
import {ActivateCompanyComponent} from './activate-company/activate-company.component';
import {RegisterCheckEmailMessageComponent} from './register-check-email-message/register-check-email-message.component';
import {CostOfFreshComponent} from "@app/cost-of-fresh/cost-of-fresh.component";
import {WeekPanelComponent} from "@app/week-panel/week-panel.component";
import {ProjectionComponent} from './projection/projection.component'
import {SalesComponent} from "@app/sales/sales.component";
import { SchedulerComponent } from './scheduler_elements/scheduler/scheduler.component';
import { EmployeeListComponent } from './employees/employee-list/employee-list.component';
import {CretateEmployeeComponent} from './employees/cretate-employee/cretate-employee.component';
import {EditEmployeeComponent} from './employees/edit-employee/edit-employee.component';
import {EmployeeParentComponent} from "@app/employees/employee-parent/employee-parent.component";
import { CompanyemployeeListComponent} from './companyemployee/companyemployee-list/companyemployee-list.component';
import { CreateCompanyemployeeComponent} from './companyemployee/create-companyemployee/create-companyemployee.component';
import { EditCompanyemployeeComponent} from './companyemployee/edit-companyemployee/edit-companyemployee.component';
import { User,Role } from './_models';

const routes: Routes = [
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard],data: { roles: [Role.ROOT, Role.EMPLOYEE, Role.COMPANYADMIN, Role.STOREMANAGER] }},
    { path: 'login', component: LoginComponent },
    { path: 'stores', component: StoreListComponent, canActivate: [AuthGuard],data: { roles: [Role.ROOT, Role.COMPANYADMIN, Role.STOREMANAGER] }},
    { path: 'storecreate', component: CreateStoreComponent, canActivate: [AuthGuard],data: { roles: [Role.ROOT, Role.COMPANYADMIN, Role.STOREMANAGER] }},
    { path: 'storeedit/:id', component: EditStoreComponent, canActivate: [AuthGuard],data: { roles: [Role.ROOT, Role.COMPANYADMIN, Role.STOREMANAGER] } },
    { path: 'register-general-data', component: RegisterGeneralDataComponent },
    { path: 'register-plan-data', component: RegisterPlanDataComponent },
    { path: 'register-cc-data', component: RegisterCcDataComponent },
    { path: 'activate-company/:activation_code', component: ActivateCompanyComponent },
    { path: 'check-email-message', component: RegisterCheckEmailMessageComponent },
    { path: 'cost-of/:what', component: CostOfFreshComponent },
    { path: 'week-panel/:cost_of/:id', component: WeekPanelComponent },
    { path: 'sales', component: SalesComponent },
    { path: 'projections', component: ProjectionComponent },
    { path: 'scheduler', component: SchedulerComponent },
    { path: 'employees', component: EmployeeParentComponent },
    { path: 'employees-list', component: EmployeeListComponent },
    { path: 'create-employee', component: CretateEmployeeComponent },
    { path: 'edit-employee/:id', component: EditEmployeeComponent },
    { path: 'companyemployee-list', component: CompanyemployeeListComponent },
    { path: 'create-companyemployee', component: CreateCompanyemployeeComponent },
    { path: 'edit-companyemployee/:id', component: EditCompanyemployeeComponent },

    // otherwise redirect to home
    { path: '**', redirectTo: 'home' }
];

export const appRoutingModule = RouterModule.forRoot(routes);