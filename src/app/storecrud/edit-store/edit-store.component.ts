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
	
	
  @ViewChild('csvInput',{static: false}) inputVariable: ElementRef;
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
  selectedCsvFile: ImageSnippet;
  employees: any[];
  storeId: string;
  fileName: string = '';


  constructor(
      private formBuilder: FormBuilder,
      private route: ActivatedRoute,
      private router: Router,
      private storeService: StoreService,
      private employeeService: EmployeeService,
      private messageToastService: MessageToastService,
      private confirmationService: ConfirmationService,
	  private checkRole: CheckRole,
	  private messageService: MessageService
	) {
    this.selectedFile = new ImageSnippet('', null);
	this.selectedCsvFile = new ImageSnippet('', null);
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
	  target_percentage: ['', Validators.required],
      target_costof_goods: ['', Validators.required],
      target_costof_fresh: ['', Validators.required],
      contact_email: ['',  Validators.email],
      contact_phone: ['', [Validators.minLength(8),Validators.maxLength(8)]],
      zip_code: ['', [Validators.minLength(5),Validators.maxLength(6)]],
      address: [''],
      city: [''],
      state: [''],
	  sui: ['', Validators.required],
	  futa: ['', Validators.required],
	  social_security: ['', Validators.required],
	  medicare: ['', Validators.required],

    });
	this.csvForm = this.formBuilder.group({
      target_percentage: ['', Validators.required],
    });
    this.route.params.subscribe(params => {
      this.storeService.getStore(params['id']).subscribe(res => {
        this.store = res.store;
        this.f.store_name.setValue(this.store.store_name);
        this.f.contact_email.setValue(this.store.contact_email);
        this.f.contact_phone.setValue(this.store.contact_phone);
        this.f.zip_code.setValue(this.store.zip_code);
        this.f.city.setValue(this.store.city);
        this.f.state.setValue(this.store.state);
        this.f.address.setValue(this.store.address);
		this.f.target_percentage.setValue(this.store.target_percentage_default);
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
      console.log(this.employees);
	  
	  this.storeService.getStoreImage(id).subscribe(res => {
          const file: File = res;
          const reader = new FileReader();
          reader.addEventListener('load', (event: any) => {
            this.selectedFile = new ImageSnippet(event.target.result, file);
            console.log(this.selectedFile.file);
          });
          reader.readAsDataURL(file);
        });
	  
    });
  }

  processFile(imageInput: any) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', (event: any) => {
      this.selectedFile = new ImageSnippet(event.target.result, file);
      console.log(this.selectedFile.file);
    });
    reader.readAsDataURL(file);
  }
  
  processCsvFile(csvInput: any) {
    const file: File = csvInput.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', (event: any) => {
      this.selectedCsvFile = new ImageSnippet(event.target.result, file);
      console.log(this.selectedCsvFile.file);
	  this.fileName = this.selectedCsvFile.file.name;
    });
    reader.readAsDataURL(file);
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
      console.log("pepe"+params['id'])

      this.storeService.updateStore(params['id'],this.f.store_name.value,this.f.contact_email.value,
          this.f.contact_phone.value,this.f.zip_code.value,this.f.address.value,this.f.city.value,this.f.state.value,this.f.target_percentage.value,this.selectedFile.file,this.f.target_costof_goods.value,this.f.target_costof_fresh.value,
          this.f.sui.value,this.f.futa.value,this.f.social_security.value,this.f.medicare.value ).subscribe(
              data=> {
			    let response = data;
				if(response.status=='error')
			      this.messageToastService.sendMessage('error', 'Store Message', response.errors);
			    else
			    {
				  this.messageToastService.sendMessage('success', 'Store Message', 'Store updated successfully !');
				  this.messageService.sendMessageReloadStore();	
				}
			    this.loading = false;
                //this.messageToastService.sendMessage('success', 'Store Message', 'Store updated successfully !');
               // console.log(response)
              },
              error => {
                console.log(error)
                this.messageToastService.sendMessage('error', 'Store Message', error);
                this.loading = false;
              }
          );
    });
  }
  
  uploadCsv()
  {
	  this.submittedCsv = true;
	  if (this.csvForm.invalid) {
	     this.loading = false;
	     return;
	  }
	  if(this.selectedCsvFile.file==null)
	  {
		  this.messageToastService.sendMessage('error', 'Store Message', 'Seleccione un archivo .CVS');
		  return;
	  }
	  this.loadingCsv = true;
	  this.storeService.uploadCsv(this.storeId,this.selectedCsvFile.file,this.c.target_percentage.value).subscribe(
              response=> {
                this.messageToastService.sendMessage('success', 'Store Message', 'Weekly Projection Percent Revenues set successfully !');
                // console.log(response)
			    this.loadingCsv = false;
				this.fileName = '';
				this.selectedCsvFile = new ImageSnippet('', null);
				this.inputVariable.nativeElement.value = "";
				this.submittedCsv = false;
              },
              error => {
                console.log(error)
                this.messageToastService.sendMessage('error', 'Store Message', error);
                this.loadingCsv = false;
              }
          );
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
