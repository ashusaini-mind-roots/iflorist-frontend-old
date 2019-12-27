import { Observable } from "rxjs";
import { StoreService } from "../../_services/store.service";
import { EmployeeService } from "../../_services/employee.service";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import {ConfirmationService} from "primeng/api";
import { MessageToastService } from "../../_services/messageToast.service";


class ImageSnippet {
  pending: boolean = false;
  status: string = 'init';

  constructor(public src: string, public file: File) { }
}

@Component({
  selector: 'app-edit-store',
  templateUrl: './edit-store.component.html',
  styleUrls: ['./edit-store.component.less'],
  providers: [ConfirmationService]
})
export class EditStoreComponent implements OnInit {
  storeEditform: FormGroup;
  store: any = {};
  submitted = false;
  // returnUrl: string;
  error = '';
  success = '';
  loading = false;
  selectedFile: ImageSnippet;
  employees: any[];


  constructor(
      private formBuilder: FormBuilder,
      private route: ActivatedRoute,
      private router: Router,
      private storeService: StoreService,
      private employeeService: EmployeeService,
      private messageToastService: MessageToastService,
      private confirmationService: ConfirmationService,
	) {
    this.selectedFile = new ImageSnippet('', null);
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

  ngOnInit() {
    this.storeEditform = this.formBuilder.group({
      store_name: ['', Validators.required],
	  target_percentage: ['', Validators.required],
      contact_email: ['',  Validators.email],
      contact_phone: ['', [Validators.minLength(8),Validators.maxLength(8)]],
      zip_code: ['', [Validators.minLength(5),Validators.maxLength(6)]],
      address: [''],
      city: [''],
      state: ['']
    });
    //console.log("pepitotey");
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
        console.log(params['id']);
      });

      this.getEmployees(params['id']);

    });
  }

  getEmployees(id:string)
  {
    this.storeService.getEmployees(id).subscribe(res => {
      this.employees = res.employees;
      console.log(this.employees);
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
          this.f.contact_phone.value,this.f.zip_code.value,this.f.address.value,this.f.city.value,this.f.state.value,this.f.target_percentage.value).subscribe(
              response=> {
                this.loading = false;
                this.messageToastService.sendMessage('success', 'Store Message', 'Store updated successfully successfully !');
               // console.log(response)
              },
              error => {
                console.log(error)
                this.messageToastService.sendMessage('error', 'Employee Message', error);
                this.loading = false;
              }
          );
    });
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

}
