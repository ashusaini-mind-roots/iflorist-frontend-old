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
import { EditStoreComponent } from './storecrud/edit-store/edit-store.component';
import { RegisterGeneralDataComponent } from './register-general-data/register-general-data.component';
import { RegisterPlanDataComponent } from './register-plan-data/register-plan-data.component';
import { RegisterCcDataComponent } from './register-cc-data/register-cc-data.component';
import { ActivateCompanyComponent } from './activate-company/activate-company.component';
import { RegisterCheckEmailMessageComponent } from './register-check-email-message/register-check-email-message.component';
import { StoresComboComponent } from './top_bar_elements/stores-combo/stores-combo.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ChartModule} from 'primeng/chart';
import {TableModule} from 'primeng/table';
import {ToastModule} from 'primeng/toast';
import {DialogModule} from 'primeng/dialog';
import {MenubarModule} from 'primeng/menubar';
import {TieredMenuModule} from 'primeng/tieredmenu';
import {MenuModule} from 'primeng/menu';
//import {MenuItem} from 'primeng/api';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ConfirmationService} from 'primeng/api';
import { CostOfFreshComponent } from './cost-of-fresh/cost-of-fresh.component';
import { YearQuarterComponent } from './year-quarter/year-quarter.component';
import { MessageService } from './_services/message.service';;
import { WeekPanelComponent } from './week-panel/week-panel.component';
import { ProjectionComponent } from './projection/projection.component';
import { SalesComponent } from './sales/sales.component';
import { MessageComponent } from './message/message.component';
import { SchedulerComponent } from './scheduler_elements/scheduler/scheduler.component';
import { FinanceViewComponent } from './scheduler_elements/finance-view/finance-view.component';
import { CalendarViewComponent } from './scheduler_elements/calendar-view/calendar-view.component';
import { EmployeeListComponent } from './employees/employee-list/employee-list.component';
import { EmployeeParentComponent } from './employees/employee-parent/employee-parent.component';
import { CretateEmployeeComponent } from './employees/cretate-employee/cretate-employee.component';
import { EditEmployeeComponent } from './employees/edit-employee/edit-employee.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { formatPhone } from './pipes/formatPhone';
import { CompanyemployeeListComponent } from './companyemployee/companyemployee-list/companyemployee-list.component';
import { CreateCompanyemployeeComponent } from './companyemployee/create-companyemployee/create-companyemployee.component';
import { EditCompanyemployeeComponent } from './companyemployee/edit-companyemployee/edit-companyemployee.component';
import { AppUserListComponent } from './app-user/app-user-list/app-user-list.component';
import { AppUserCreateComponent } from './app-user/app-user-create/app-user-create.component';
import { AppUserEditComponent } from './app-user/app-user-edit/app-user-edit.component';
import { SchedulerCalendarViewComponent } from './scheduler_elements/scheduler-calendar-view/scheduler-calendar-view.component';;
import { UsersettingsComponent } from './top_bar_elements/usersettings/usersettings.component';
@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        FormsModule,
        NgbModule,
        HttpClientModule,
        appRoutingModule,
        BrowserAnimationsModule,
        TableModule,
        DialogModule,
        ToastModule,
        ConfirmDialogModule,
        ChartModule,
        //BsDropdownModule.forRoot(),
        NgxIntlTelInputModule,
		MenubarModule,
		TieredMenuModule,
		MenuModule
		//MenuItem
    ],
    declarations: [
        formatPhone,
        AppComponent,
        HomeComponent,
        LoginComponent,
        StoreListComponent,
        CreateStoreComponent,
        EditStoreComponent,
        RegisterGeneralDataComponent,
        RegisterPlanDataComponent,
        RegisterCcDataComponent,
        ActivateCompanyComponent
        ,
        RegisterCheckEmailMessageComponent
        ,
        StoresComboComponent
        ,
        CostOfFreshComponent,
        YearQuarterComponent,
        WeekPanelComponent,
        SalesComponent,
        ProjectionComponent,
        MessageComponent,
        SchedulerComponent,
        FinanceViewComponent,
        CalendarViewComponent,
        EmployeeListComponent,
        EmployeeParentComponent,
        CretateEmployeeComponent
        ,
        EditEmployeeComponent
        ,
        CompanyemployeeListComponent
        ,
        CreateCompanyemployeeComponent,
        EditCompanyemployeeComponent,
        AppUserListComponent,
        AppUserCreateComponent,
        AppUserEditComponent,
        SchedulerCalendarViewComponent,
        UsersettingsComponent
    ],

        

    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        MessageService,
        ConfirmationService
        // provider used to create fake backend
        /*fakeBackendProvider*/
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }