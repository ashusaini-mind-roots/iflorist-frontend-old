import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// used to create fake backend
import { fakeBackendProvider } from './_helpers';

import { AppComponent } from './app.component';
import { appRoutingModule } from './app.routing';

import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { StoreListComponent } from './storecrud/store-list/store-list.component';
import { CreateStoreComponent } from './storecrud/create-store/create-store.component';
import { EditStoreComponent } from './storecrud/edit-store/edit-store.component'

import { RegisterGeneralDataComponent } from './register-general-data/register-general-data.component';
import { RegisterPlanDataComponent } from './register-plan-data/register-plan-data.component';
import { RegisterCcDataComponent } from './register-cc-data/register-cc-data.component';
import { ActivateCompanyComponent } from './activate-company/activate-company.component'
@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        FormsModule,
        NgbModule,
        HttpClientModule,
        appRoutingModule
    ],
    declarations: [
        AppComponent,
        HomeComponent,
        LoginComponent,
        StoreListComponent,
        CreateStoreComponent ,
        EditStoreComponent ,
        RegisterGeneralDataComponent,
        RegisterPlanDataComponent ,
        RegisterCcDataComponent ,
        ActivateCompanyComponent
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        // provider used to create fake backend
        /*fakeBackendProvider*/
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }