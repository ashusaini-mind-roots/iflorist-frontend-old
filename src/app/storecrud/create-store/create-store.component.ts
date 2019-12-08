import { Observable } from "rxjs";
import { StoreService } from "../../_services/store.service";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';


class ImageSnippet {
  pending: boolean = false;
  status: string = 'init';

  constructor(public src: string, public file: File) { }
}

@Component({
  selector: 'app-create-store',
  templateUrl: './create-store.component.html',
  styleUrls: ['./create-store.component.less']
})
export class CreateStoreComponent implements OnInit {
  storeform: FormGroup;
  loading = false;
  submitted = false;
  // returnUrl: string;
  error = '';
  success = '';
  selectedStorage: any;
  selectedFile: ImageSnippet;

  constructor(
      private formBuilder: FormBuilder,
      private route: ActivatedRoute,
      private router: Router,
      private storeService: StoreService,
      
  ) {
      this.selectedFile = new ImageSnippet('', null);
  }

  ngOnInit() {
    this.storeform = this.formBuilder.group({
      store_name: ['', Validators.required],
      contact_email: ['',  Validators.email],
      contact_phone: [''],
      zip_code: ['', [Validators.minLength(5),Validators.maxLength(6)]],
      address: [''],
      city: [''],
      state: ['']
    });

    // get return url from route parameters or default to '/'
    // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
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

  // convenience getter for easy access to form fields
  get f() { return this.storeform.controls; }

  onSubmit(){
    this.submitted = true;

    // stop here if form is invalid
    if (this.storeform.invalid) {
      this.loading = false;
      return;
    }
    this.error = '';
    this.success = '';
    this.loading = true;
    // store_name,contact_email,contact_phone,zip_code,address
    this.storeService.createStore(this.selectedFile.file,this.f.store_name.value, this.f.contact_email.value, this.f.contact_phone.value,
        this.f.zip_code.value,this.f.address.value,this.f.city.value,this.f.state.value)
        .pipe(first())
        .subscribe(
            data => {
              //console.log(data);
              this.loading = false;
              this.success = 'Store added succefull !';
              this.clean();
              //this.router.navigate([this.returnUrl]);
            },
            error => {
              console.log(error)
              this.error = error;
              this.loading = false;
            });
  }

  clean(){
     this.f.store_name.setValue('');
     this.f.contact_email.setValue('');
     this.f.contact_phone.setValue('');
     this.f.zip_code.setValue('');
     this.f.address.setValue('');
     this.selectedFile = new ImageSnippet('', null);
     this.submitted = false;
  }

}
