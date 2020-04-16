import { Observable } from "rxjs";
import { StoreService } from "../../_services/store.service";
import { EmployeeService } from "../../_services/employee.service";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import {ConfirmationService} from "primeng/api";
import { MessageToastService } from "../../_services/messageToast.service";
import { CheckRole } from "../../_helpers/check-role";
import { MessageService } from "../../_services/message.service";
import { RevenueCsvRecord } from "../../_models/revenues_csv_record";



class ImageSnippet {
    pending: boolean = false;
    status: string = 'init';

    constructor(public src: string, public file: File) { }
}

@Component({
    selector: 'app-edit-store',
    templateUrl: './edit-store.component.html',
    styleUrls: ['./edit-store.component.less'],
    providers: [ConfirmationService,CheckRole]
})
export class EditStoreComponent implements OnInit {


    // @ViewChild('csvInput',{static: false}) inputVariable: ElementRef;
    //@ViewChild('csvInput') inputVariable;
    storeEditform: FormGroup;
    csvForm: FormGroup;
    store: any = {};
    submitted = false;
    submittedCsv = false;
    // returnUrl: string;
    error = '';
    success = '';
    loading = false;
    loadingCsv = false;
    selectedFile: ImageSnippet;
    // selectedCsvFile: ImageSnippet;
    employees: any[];
    storeId: string;
    fileName: string = '';
    dataResut:any;
    checkProjectionPercent: boolean;

    records: any[] = [];
    limit_records_to_send: number = 14;
    records_pos:any = 0;
    uploaded_percentage: number = 0;
    current_block_number: number = 0;



    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private storeService: StoreService,
        private employeeService: EmployeeService,
        private messageToastService: MessageToastService,
        private confirmationService: ConfirmationService,
        private checkRole: CheckRole,
        private messageService: MessageService,
    ) {
        this.selectedFile = new ImageSnippet('', null);
        // this.selectedCsvFile = new ImageSnippet('', null);
    }

    checkStoreProjectionPercent(checked){
        if(checked){
            this.c.projection_percentage.setValue(this.f.projection_percentage.value);
        }else this.c.projection_percentage.setValue(null);
    }

    formatNumberPhone(number:string)
    {

        let length = number.length;
        let data = '';

        for(let i=0;i<length;i++)
        {
            if(!isNaN(Number(number.charAt(i))))
            {
                data = data + number.charAt(i);
            }
        }

        this.f.contact_phone.setValue(data);

    }

    formatNumberZip(number:string)
    {

        let length = number.length;
        let data = '';

        for(let i=0;i<length;i++)
        {
            if(!isNaN(Number(number.charAt(i))))
            {
                data = data + number.charAt(i);
            }
        }

        this.f.zip_code.setValue(data);

    }

    // convenience getter for easy access to form fields
    get f() { return this.storeEditform.controls; }

    get c() { return this.csvForm.controls; }

    ngOnInit() {
        this.storeEditform = this.formBuilder.group({
            store_name: ['', Validators.required],
            target_percentage: ['', [Validators.required,Validators.pattern(/^0$|^[1-9][0-9]?$|^100$/)]],
            projection_percentage: ['', [Validators.required,Validators.pattern(/^0$|^[1-9][0-9]?$|^100$/)]],
            target_costof_goods: ['', [Validators.required,Validators.pattern(/^0$|^[1-9][0-9]?$|^100$/)]],
            target_costof_fresh: ['', [Validators.required,Validators.pattern(/^0$|^[1-9][0-9]?$|^100$/)]],
            contact_email: ['',  Validators.email],
            contact_phone: ['',[Validators.pattern(/^\(\d{3}\)\s\d{3}-\d{4}$/),Validators.minLength(14),Validators.maxLength(14)]],
            zip_code: ['', [Validators.minLength(5),Validators.maxLength(6)]],
            address: [''],
            city: [''],
            state: [''],
            sui: ['', Validators.required],
            futa: ['', Validators.required],
            social_security: ['', Validators.required],
            medicare: ['', Validators.required],
            website: ['', [Validators.pattern(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/)]],

        });
        this.csvForm = this.formBuilder.group({
            projection_percentage: ['', [Validators.required,Validators.pattern(/^0$|^[1-9][0-9]?$|^100$/)]],
        });
        this.route.params.subscribe(params => {
            this.storeService.getStore(params['id']).subscribe(res => {
                this.store = res.store;
                if(this.store.store_name)
                    this.f.store_name.setValue(this.store.store_name);
                if(this.store.contact_email)
                    this.f.contact_email.setValue(this.store.contact_email);
                if(this.store.contact_phone)
                    this.f.contact_phone.setValue(this.store.contact_phone);
                if(this.store.zip_code)
                    this.f.zip_code.setValue(this.store.zip_code);
                if(this.store.city)
                    this.f.city.setValue(this.store.city);
                if(this.store.state)
                    this.f.state.setValue(this.store.state);
                if(this.store.address)
                    this.f.address.setValue(this.store.address);
                if(this.store.website)
                    this.f.website.setValue(this.store.website);
                this.f.target_percentage.setValue(this.store.target_percentage_default);
                this.f.projection_percentage.setValue(this.store.projection_percentage_default);
                this.f.target_costof_goods.setValue(this.store.target_cog);
                this.f.target_costof_fresh.setValue(this.store.target_cof);

                this.f.sui.setValue(this.store.sui);
                this.f.futa.setValue(this.store.futa);
                this.f.social_security.setValue(this.store.social_security);
                this.f.medicare.setValue(this.store.medicare);

                console.log(this.store);
                this.storeId = params['id'];
            });

            this.getEmployees(params['id']);

        });
    }

    getEmployees(id:string)
    {
		this.storeService.getEmployees(id).subscribe(res => {
            this.employees = res.employees;
		});
		this.storeService.getStoreImage(id).subscribe(res => {
                const file: File = res;
                const reader = new FileReader();
                reader.addEventListener('load', (event: any) => {
                    this.selectedFile = new ImageSnippet(event.target.result, file);
                });
                reader.readAsDataURL(file);
            });
    }

    processFile(imageInput: any) {
        const file: File = imageInput.files[0];
        const reader = new FileReader();
        reader.addEventListener('load', (event: any) => {
            this.selectedFile = new ImageSnippet(event.target.result, file);
        });
        reader.readAsDataURL(file);
    }




    isValidCSVFile(file: any) {
       // console.log(file)
        return file.name.endsWith(".csv");
    }

    getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {
        let csvArr = [];

        for (let i = 1; i < csvRecordsArray.length; i++) {
            let curruntRecord = (<string>csvRecordsArray[i]).split(';');
            if (curruntRecord.length == headerLength) {
                let csvRecord: RevenueCsvRecord = new RevenueCsvRecord();
                csvRecord.id = i;
                csvRecord.date_revenue = curruntRecord[0].trim();
                csvRecord.merchandise = curruntRecord[1].trim();
                csvRecord.wire = curruntRecord[2].trim();
                csvRecord.delivery = curruntRecord[3].trim();
                csvArr.push(csvRecord);
            }
        }
        return csvArr;
    }

    editStore(){
        this.submitted = true;
        if (this.storeEditform.invalid) {
            this.loading = false;
            return;
        }
        this.error = '';
        this.success = '';
        this.loading = true;
        this.route.params.subscribe(params => {

            this.storeService.updateStore(params['id'],this.f.store_name.value,this.f.contact_email.value,
                this.f.contact_phone.value,this.f.zip_code.value,this.f.address.value,this.f.city.value,this.f.state.value,this.f.target_percentage.value,this.f.projection_percentage.value,this.selectedFile.file,this.f.target_costof_goods.value,this.f.target_costof_fresh.value,
                this.f.sui.value,this.f.futa.value,this.f.social_security.value,this.f.medicare.value, this.f.website.value )
                .pipe()
                .subscribe(
                    (data: any) => {
                        if(data.status=='error')
                            this.messageToastService.sendMessage('error', 'Store Message', data.errors);
                        else
                        {
                            this.messageToastService.sendMessage('success', 'Store Message', 'Store updated successfully !');
                            this.messageService.sendMessageReloadStore();
                        }
                        this.loading = false;
                    },
                    error => {
                        console.log(error)
                        this.messageToastService.sendMessage('error', 'Store Message', error);
                        this.loading = false;
                    }
                );
        });
    }

    processCsvFile(csvInput: any) {
        // const file: File = csvInput.files[0];
        // const reader = new FileReader();
        // reader.addEventListener('load', (event: any) => {
        //     this.selectedCsvFile = new ImageSnippet(event.target.result, file);
        //   //  console.log(this.selectedCsvFile.file);
        //     this.fileName = this.selectedCsvFile.file.name;
        // });
        // reader.readAsDataURL(file);


        //*******//
        let file = csvInput.files[0];
        if (this.isValidCSVFile(file)) {
            let reader = new FileReader();
            reader.readAsText(file);
            this.fileName = file.name;
            reader.onload = () => {
                let csvData = reader.result;
                let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);
                this.records = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, /*headersRow.length*/4);
                console.log(this.records.length, this.records);
            };
        }
    }

    uploadCsv()
    {
        this.submittedCsv = true;
        if (this.csvForm.invalid) {
            this.loading = false;
            return;
        }
        if(this.records.length <= 0)
        {
            this.messageToastService.sendMessage('error', 'Store Message', 'Select a not empty CSV file.');
            return;
        }
        this.loadingCsv = true;
        this.sendingCSV();

/* this.submittedCsv = true;
 if (this.csvForm.invalid) {
     this.loading = false;
     return;
 }
 if(this.selectedCsvFile.file==null)
 {
     this.messageToastService.sendMessage('error', 'Store Message', 'Select a CSV file');
     return;
 }
 this.loadingCsv = true;
 this.storeService.uploadCsv(this.storeId,this.selectedCsvFile.file,this.c.projection_percentage.value).subscribe(
     (response:any) => {
         if(response.status == 'error')
         {
             this.messageToastService.sendMessage('error', 'Store Message', response.error);
             console.log("There was an error uploading CSV file. " + response.message);
             this.loadingCsv = false;
         }
         else if(response.status == 'success')
         {
             this.loadingCsv = false;
             this.fileName = '';
             this.selectedCsvFile = new ImageSnippet('', null);
             this.inputVariable.nativeElement.value = "";
             this.submittedCsv = false;
             this.messageToastService.sendMessage('success', 'Store Message', 'Weekly Projection Percent Revenues uploaded successfully !');
         }
         this.submittedCsv = false;
     },
     error => {
         this.messageToastService.sendMessage('error', 'Store Message', error);
         this.loadingCsv = false;
         this.submittedCsv = false;
         console.log("There was an error uploading csv file. ");
         console.log(error);
     }
 );*/
    }

    sendingCSV(){
        let arrayToSend = this.prepareToSendCSV();
        if(arrayToSend.length > 0){

            //send array to the server and wait for answer
            this.storeService.uploadCsv(this.storeId,this.c.projection_percentage.value,arrayToSend).subscribe(
                (response:any) => {
                    if(response.status == 'error')
                    {
                        this.messageToastService.sendMessage('error', 'Store Message', response.error);
                        console.log("There was an error uploading CSV file. " + response.message);
                        this.loadingCsv = false;
                        this.cleanForNextFileUpload();
                    }
                    else if(response.status == 'success')
                    {
                        this.current_block_number++;
                        this.updateUploadedPercentage();
                        this.sendingCSV();
                        // this.loadingCsv = false;
                        // this.fileName = '';
                        // this.selectedCsvFile = new ImageSnippet('', null);
                        // this.inputVariable.nativeElement.value = "";
                        // this.submittedCsv = false;
                        // this.messageToastService.sendMessage('success', 'Store Message', 'Weekly Projection Percent Revenues uploaded successfully !');
                    }
                    this.submittedCsv = false;
                },
                error => {
                    this.messageToastService.sendMessage('error', 'Store Message', error);
                    this.loadingCsv = false;
                    this.submittedCsv = false;

                    this.cleanForNextFileUpload();

                    console.log("There was an error uploading csv file. ");
                    console.log(error);
                }
            );
        }else{
            //leave all clean for the next file upload
            this.cleanForNextFileUpload();
            this.loadingCsv = false;
            this.submittedCsv = false;
        }
    }

    cleanForNextFileUpload(){
        this.records_pos = 0;
        this.uploaded_percentage = 0;
        this.current_block_number = 0;
        this.records_pos = 0;
        this.records = [];
        this.fileName = '';
    }
    updateUploadedPercentage(){
        let total = this.records.length / this.limit_records_to_send;
        this.uploaded_percentage = Math.round(this.current_block_number * 100 / total);
    }

    prepareToSendCSV(){
        let arrayToSend = [];
        let i ;
        for (i = this.records_pos ; i < this.records_pos + this.limit_records_to_send ; i++){
            let record = this.records[i];
            console.log(i, record)
            if(record != undefined){
                let date = record.date_revenue.split("/");
                date = date[2] + '-' + date[0] + '-' + date[1];
                let merchandise = record.merchandise;
                let wire = record.wire;
                let delivery = record.delivery;

                arrayToSend.push({
                    date_revenue: date,
                    merchandise : merchandise,
                    wire : wire,
                    delivery : delivery
                })
            }else{//if there is no more records then leave the loop and set i with the last index to begin the next iteration after server response
                i++;
                break;
            }
        }
        this.records_pos = i;
        console.log(i,arrayToSend);
        return arrayToSend;
    }


    deleteEmployee(id:string)
    {
        this.confirmDeleteEmployee(id);
    }

    confirmDeleteEmployee(id:string) {
        this.confirmationService.confirm({
            message: 'Are you sure that you want to delete the Employee ?',
            accept: () => {
                this.employeeService.deleteEmployee(id).subscribe((response: any) =>{
                    this.messageToastService.sendMessage('success','Employee Message','One employee was deleted !');
                    this.getEmployees(id);
                });
            }
        });
    }

    showActionUploadCSV()
    {
        if(this.checkRole.isRoot() || this.checkRole.isCompanyAdmin() || this.checkRole.isStoreManager())
            return true;
        else return false;
    }

}
