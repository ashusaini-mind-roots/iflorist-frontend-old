﻿import { Routes, RouterModule } from '@angular/router';

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
const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'stores', component: StoreListComponent },
    { path: 'storecreate', component: CreateStoreComponent },
    { path: 'storeedit/:id', component: EditStoreComponent },
    { path: 'register-general-data', component: RegisterGeneralDataComponent },
    { path: 'register-plan-data', component: RegisterPlanDataComponent },
    { path: 'register-cc-data', component: RegisterCcDataComponent },
    { path: 'activate-company', component: ActivateCompanyComponent },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const appRoutingModule = RouterModule.forRoot(routes);