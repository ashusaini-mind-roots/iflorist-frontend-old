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

const routes: Routes = [
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'stores', component: StoreListComponent, canActivate: [AuthGuard]},
    { path: 'storecreate', component: CreateStoreComponent, canActivate: [AuthGuard]},
    { path: 'storeedit/:id', component: EditStoreComponent, canActivate: [AuthGuard] },
    { path: 'register-general-data', component: RegisterGeneralDataComponent },
    { path: 'register-plan-data', component: RegisterPlanDataComponent },
    { path: 'register-cc-data', component: RegisterCcDataComponent },
    { path: 'activate-company/:activation_code', component: ActivateCompanyComponent },
    { path: 'check-email-message', component: RegisterCheckEmailMessageComponent },
    { path: 'cost-of-fresh', component: CostOfFreshComponent },
    { path: 'week-panel', component: WeekPanelComponent },

    // otherwise redirect to home
    { path: '**', redirectTo: 'home' }
];

export const appRoutingModule = RouterModule.forRoot(routes);