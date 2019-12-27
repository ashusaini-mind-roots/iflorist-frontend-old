import { Component, OnInit } from '@angular/core';
import { StatuService } from '../../_services/statu.service';
import { CategoryService } from '../../_services/category.service';
import { WorkmancombService } from '../../_services/workmancomb.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompanyemployeeService } from '../../_services/companyemployee.service';
import { MessageToastService } from '../../_services/messageToast.service';
import {AuthenticationService} from '../../_services/authentication.service';
import { StoreSubscriberService } from "../../_services/storeSubscriber.service";


class ImageSnippet {
  pending: boolean = false;
  status: string = 'init';

  constructor(public src: string, public file: File) { }
}

@Component({
  selector: 'app-create-companyemployee',
  templateUrl: './create-companyemployee.component.html',
  styleUrls: ['./create-companyemployee.component.less']
})

export class CreateCompanyemployeeComponent implements OnInit {
  status: any[];
  categories: any[];
  companyemployeeform: FormGroup;
  submitted = false;
  selectedFile: ImageSnippet;
  loading = false;
  error: string = '';
  systemUser : boolean = false;
  email: string = '';

  constructor(
    private statuService: StatuService,
    private categoryService: CategoryService,
    private formBuilder: FormBuilder,
    private companyEmployeeService: CompanyemployeeService,
    private message: MessageToastService,
    private authenticationService: AuthenticationService,
	private storeSubscriberService: StoreSubscriberService
    ) {
    this.selectedFile = new ImageSnippet('', null);
	storeSubscriberService.subscribe(this,function (ref,store) {
      ref.receiveStorage(store);
    });
  }

  onChangeSysteAccount()
  {
    this.systemUser = !this.systemUser;
    if(this.f.system_account.value=='1')
    {
      this.f.email.setValidators([Validators.required, Validators.email]);
      this.f.email.updateValueAndValidity();
    }
    else
    {
      this.f.email.setValidators(null);
      this.f.email.updateValueAndValidity();
    }
      
  }

  ngOnInit() {
    //this.selectedStorage.id = 1;
    this.companyemployeeform = this.formBuilder.group({
      name: ['', Validators.required],
      status: ['', Validators.required],
      phone_number: ['', [Validators.required,Validators.minLength(8),Validators.maxLength(8)]],
      email: [''],
      active: ['1'],
      system_account: ['0'],
    });
    this.getStatuList();
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
     
     this.f.phone_number.setValue(data);
     
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
    console.log('status' + ' ' + this.f.status.value);
    if(this.f.system_account.value=='1')
      this.email = this.f.email.value;
    this.companyEmployeeService.createCompanyEmployee(this.authenticationService.currentUserValue.company.id,this.f.name.value, this.email , this.f.status.value, this.f.phone_number.value, this.selectedFile.file, this.f.active.value,this.f.system_account.value)
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
            this.clean();
            this.message.sendMessage('success', 'Company Employee Message', 'Company Employee created successfully successfully !');
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

  clean() {
    this.selectedFile = new ImageSnippet('', null);
    this.f.name.setValue('');
    this.f.email.setValue('');
    this.f.phone_number.setValue('');
    this.f.status.setValue('');
    this.f.active.setValue('1');
    this.f.system_account.setValue('0');
    this.systemUser = false;
    this.f.email.setValidators(null);
    this.f.email.updateValueAndValidity();
    this.submitted = false;
    this.error = '';
    
    //this.onChangeSysteAccount();

  }
}
