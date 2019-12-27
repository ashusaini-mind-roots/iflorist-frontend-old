import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../../_services/employee.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StatuService } from '../../_services/statu.service';
import { CategoryService } from '../../_services/category.service';
import { WorkmancombService } from '../../_services/workmancomb.service';
import { MessageToastService } from '../../_services/messageToast.service';
import { StoreSubscriberService } from "../../_services/storeSubscriber.service";

class ImageSnippet {
  pending: boolean = false;
  status: string = 'init';

  constructor(public src: string, public file: File) { }
}

@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.less']
})
export class EditEmployeeComponent implements OnInit {

  employee : any;
  selectedFile: ImageSnippet;
  status: any[];
  categories: any[];
  workmancombs: any[];
  employeeform: FormGroup;
  submitted = false;
  loading = false;
  error: string = '';
  selectedStorage: any;
  systemUser : boolean = false;
  email: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute, 
    private employeeService: EmployeeService,
    private statuService: StatuService,
    private categoryService: CategoryService,
    private workmancombService: WorkmancombService,
    private formBuilder: FormBuilder,
    private message: MessageToastService,
    private storeSubscriberService: StoreSubscriberService) 
  {
    this.selectedFile = new ImageSnippet('', null);
    storeSubscriberService.subscribe(this,function (ref,store) {
      ref.receiveStorage(store);
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.employeeService.getEmployee(params['id']).subscribe(res => {
        this.employee = res.employee;
        console.log(this.employee);

        this.employeeService.getEmployeeImage(params['id']).subscribe(res => {
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
	
	this.employeeform = this.formBuilder.group({
      name: ['', Validators.required],
      status: ['', Validators.required],
      category: ['', Validators.required],
      phone_number: ['', [Validators.required,Validators.minLength(8),Validators.maxLength(8)]],
      hourlypayrate: ['', Validators.required],
      overtimeelegible: ['', Validators.required],
      workmancomb: ['', Validators.required],
      email: [''],
      active: ['1'],
      system_account: ['0'],
      year_pay: ['0'],
    });
    this.getStatuList();
    this.getCategoryList();
    this.getWorkmancombList();
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

  initFormValue(object: any)
  {
     this.f.name.setValue(object.employee.name);
     this.f.year_pay.setValue(object.employee.year_pay);
     this.f.system_account.setValue(object.employee.system_account);
     this.f.hourlypayrate.setValue(object.employee.hourlypayrate);
     this.f.status.setValue(object.employee.status_id);
     this.f.overtimeelegible.setValue(object.employee.overtimeelegible);
     this.f.category.setValue(object.employee.category_id);
     this.f.active.setValue(object.employee.active);
     this.f.phone_number.setValue(object.employee.phone_number);
     this.f.workmancomb.setValue(object.employee.work_man_comp_id);

     this.f.hourlypayrate.setValidators([Validators.required,Validators.pattern('^[0-9]+([.][0-9]+)?$')]);
     this.f.hourlypayrate.updateValueAndValidity();

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

  getCategoryList() {
    this.categoryService.getCategoryList().subscribe((data: any) => {
      this.categories = data.categories;
      //console.log(this.stores)
    });
  }

  getWorkmancombList() {
    this.workmancombService.getWorkmancombList().subscribe((data: any) => {
      this.workmancombs = data.work_mans_comp;
      //console.log(this.stores)
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.employeeform.controls; }

  onSubmit() {
    this.submitted = true;
    this.error = '';
    // stop here if form is invalid
    if (this.employeeform.invalid) {
      //this.loading = false;
      return;
    }
    /*this.error = '';
    this.success = '';*/
    this.loading = true;
    // store_name,contact_email,contact_phone,zip_code,address
    if(this.f.system_account.value=='1')
      this.email = this.f.email.value;
    this.employeeService.updateEmployee(this.employee.employee.id,this.f.name.value, this.email , this.f.category.value, this.f.status.value, this.f.workmancomb.value, this.f.phone_number.value, this.selectedFile.file, this.f.overtimeelegible.value, this.f.hourlypayrate.value, this.f.active.value/*, this.selectedStorage.id*/, this.f.year_pay.value,this.f.system_account.value)
      .pipe()
      .subscribe(
        (data: any) => {
          console.log(data);
          this.loading = false;

          if (data.error) {
            this.message.sendMessage('error', 'Employee Message', data.error);
            this.error = data.error;
          }
          else {
            this.message.sendMessage('success', 'Employee Message', 'Employee updated successfully !');
          }
          //this.success = 'Store added succefull !';
          //this.clean();
          //this.router.navigate([this.returnUrl]);
        },
        error => {
          console.log(error)
          //this.error = error;
          this.loading = false;
          this.message.sendMessage('error', 'Employee Message', error);
        });
  }

}
