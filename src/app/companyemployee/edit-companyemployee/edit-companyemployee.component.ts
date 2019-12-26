import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CompanyemployeeService } from '../../_services/companyemployee.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StatuService } from '../../_services/statu.service';
import { MessageToastService } from '../../_services/messageToast.service';
import { StoreSubscriberService } from "../../_services/storeSubscriber.service";

class ImageSnippet {
  pending: boolean = false;
  status: string = 'init';

  constructor(public src: string, public file: File) { }
}

@Component({
  selector: 'app-edit-companyemployee',
  templateUrl: './edit-companyemployee.component.html',
  styleUrls: ['./edit-companyemployee.component.less']
})
export class EditCompanyemployeeComponent implements OnInit {

  employee : any;
  selectedFile: ImageSnippet;
  status: any[];
  companyemployeeform: FormGroup;
  submitted = false;
  loading = false;
  error: string = '';
  selectedStorage: any;
  systemUser : boolean = false;
  email: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute, 
    private companyEmployeeService: CompanyemployeeService,
    private statuService: StatuService,
    private formBuilder: FormBuilder,
    private message: MessageToastService) 
  {
    this.selectedFile = new ImageSnippet('', null);
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.companyEmployeeService.getEmployee(params['id']).subscribe(res => {
        this.employee = res.employee;
        console.log(this.employee);

        this.companyEmployeeService.getEmployeeImage(params['id']).subscribe(res => {
          const file: File = res;
          const reader = new FileReader();
          reader.addEventListener('load', (event: any) => {
            this.selectedFile = new ImageSnippet(event.target.result, file);
            console.log(this.selectedFile.file);
          });
          reader.readAsDataURL(file);
        });

        this.initFormValue(this.employee);

      });
    });

    this.companyemployeeform = this.formBuilder.group({
      name: ['', Validators.required],
      status: ['', Validators.required],
      phone_number: ['', Validators.required],
      email: [''],
      active: ['1'],
      system_account: ['0'],
    });
    this.getStatuList();
  }

  initFormValue(object: any)
  {
     this.f.name.setValue(object.employee.name);
     this.f.system_account.setValue(object.employee.system_account);
     this.f.status.setValue(object.employee.status_id);
     this.f.active.setValue(object.employee.active);
     this.f.phone_number.setValue(object.employee.phone_number);
     
    if(this.f.system_account.value=='1')
     {
       this.f.email.setValue(object.user.email);
       this.f.email.setValidators([Validators.required, Validators.email]);
       this.f.email.updateValueAndValidity();
       this.systemUser = true;
     }
     else
     {
       this.f.email.setValidators(null);
       this.f.email.updateValueAndValidity();
       this.systemUser = false;
     }
     
  }

  onChangeSysteAccount()
  {
    
    this.systemUser = !this.systemUser;
    if(this.f.system_account.value=='1')
    {
      console.log('aaaaqqqqq');
      this.f.email.setValidators([Validators.required, Validators.email]);
      this.f.email.updateValueAndValidity();
    }
    else
    {
      this.f.email.setValidators(null);
      this.f.email.updateValueAndValidity();
    }
      
  }

  processFile(imageInput: any) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', (event: any) => {
      this.selectedFile = new ImageSnippet(event.target.result, file);
    });
    reader.readAsDataURL(file);
  }

  getStatuList() {
    this.statuService.getStatuList().subscribe((data: any) => {
      this.status = data.status;
      //console.log(this.stores)
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.companyemployeeform.controls; }

  onSubmit() {
    this.submitted = true;
    this.error = '';
    // stop here if form is invalid
    if (this.companyemployeeform.invalid) {
      //this.loading = false;
      return;
    }
    /*this.error = '';
    this.success = '';*/
    this.loading = true;
    // store_name,contact_email,contact_phone,zip_code,address
    if(this.f.system_account.value=='1')
      this.email = this.f.email.value;
    this.companyEmployeeService.updateEmployee(this.employee.employee.id,this.f.name.value, this.email , this.f.status.value, this.f.phone_number.value, this.selectedFile.file, this.f.active.value/*, this.selectedStorage.id*/,this.f.system_account.value)
      .pipe()
      .subscribe(
        (data: any) => {
          console.log(data);
          this.loading = false;

          if (data.error) {
            this.message.sendMessage('error', 'Company Employee Message', data.error);
            this.error = data.error;
          }
          else {
            this.message.sendMessage('success', 'Company Employee Message', 'Company Employee updated successfully !');
          }
          //this.success = 'Store added succefull !';
          //this.clean();
          //this.router.navigate([this.returnUrl]);
        },
        error => {
          console.log(error)
          //this.error = error;
          this.loading = false;
          this.message.sendMessage('error', 'Company Employee Message', error);
        });
  }

}
