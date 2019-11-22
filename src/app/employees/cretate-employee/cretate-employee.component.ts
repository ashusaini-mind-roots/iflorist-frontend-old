import { Component, OnInit } from '@angular/core';
import { StatuService } from '../../_services/statu.service';
import { CategoryService } from '../../_services/category.service';
import { WorkmancombService } from '../../_services/workmancomb.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '../../_services/employee.service';
import { MessageToastService } from '../../_services/messageToast.service';
import { StoreSubscriberService } from "../../_services/storeSubscriber.service";

class ImageSnippet {
  pending: boolean = false;
  status: string = 'init';

  constructor(public src: string, public file: File) { }
}

@Component({
  selector: 'app-cretate-employee',
  templateUrl: './cretate-employee.component.html',
  styleUrls: ['./cretate-employee.component.less']
})
export class CretateEmployeeComponent implements OnInit {

  status: any[];
  categories: any[];
  workmancombs: any[];
  employeeform: FormGroup;
  submitted = false;
  selectedFile: ImageSnippet;
  loading = false;
  error: string = '';
  selectedStorage: any;

  constructor(
    private statuService: StatuService,
    private categoryService: CategoryService,
    private workmancombService: WorkmancombService,
    private formBuilder: FormBuilder,
    private employeeService: EmployeeService,
    private message: MessageToastService,
    private storeSubscriberService: StoreSubscriberService) {
    this.selectedFile = new ImageSnippet('', null);
    storeSubscriberService.subscribe(this,function (ref,store) {
      ref.receiveStorage(store);
    });
  }

  ngOnInit() {
    this.selectedStorage = JSON.parse(localStorage.getItem('selectedStorage'));
    //this.selectedStorage.id = 1;
    this.employeeform = this.formBuilder.group({
      name: ['', Validators.required],
      status: ['', Validators.required],
      category: ['', Validators.required],
      phone_number: ['', Validators.required],
      hourlypayrate: ['', Validators.required],
      overtimeelegible: ['', Validators.required],
      workmancomb: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      active: ['1'],
    });
    this.getStatuList();
    this.getCategoryList();
    this.getWorkmancombList();
  }

  receiveStorage(storage){
    this.selectedStorage = storage;
    console.log(storage)
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
    console.log('status' + ' ' + this.f.status.value);
    this.employeeService.createEmployee(this.f.name.value, this.f.email.value, this.f.category.value, this.f.status.value, this.f.workmancomb.value, this.f.phone_number.value, this.selectedFile.file, this.f.overtimeelegible.value, this.f.hourlypayrate.value, this.f.active.value, this.selectedStorage.id)
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
            this.clean();
            this.message.sendMessage('success', 'Employee Message', 'Employee created succefully !');
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

  clean() {
    this.selectedFile = new ImageSnippet('', null);
    this.f.name.setValue('');
    this.f.email.setValue('');
    this.f.phone_number.setValue('');
    this.f.category.setValue('');
    this.f.status.setValue('');
    this.f.hourlypayrate.setValue('');
    this.f.overtimeelegible.setValue('');
    this.f.active.setValue('1');
    this.f.workmancomb.setValue('');
    this.submitted = false;
    this.error = '';

  }

}
