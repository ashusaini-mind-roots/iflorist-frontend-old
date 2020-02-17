import { Observable } from "rxjs";
import { StoreService } from "../../_services/store.service";
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Component, OnInit, Pipe, PipeTransform } from "@angular/core";
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { AngularWaitBarrier } from 'blocking-proxy/built/lib/angular_wait_barrier';
import { SearchCountryField, TooltipLabel, CountryISO } from 'ngx-intl-tel-input';
/*import {isNumeric} from 'rxjs/util/isNumeric';*/
import { MessageToastService } from '../../_services/messageToast.service';
//import { ValidatePorcentage } from '../../validator/porcentage.validator';
import { MessageService } from "../../_services/message.service";

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

  separateDialCode = true;
	SearchCountryField = SearchCountryField;
	TooltipLabel = TooltipLabel;
	CountryISO = CountryISO;
	preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];

  constructor(
      private formBuilder: FormBuilder,
      private route: ActivatedRoute,
      private router: Router,
      private storeService: StoreService,
	  private message: MessageToastService,
	  private messageService: MessageService
      
  ) {
      this.selectedFile = new ImageSnippet('', null);
  }

  ngOnInit() {
    this.storeform = this.formBuilder.group({
      store_name: ['', Validators.required],
      contact_email: ['',  Validators.email],
      contact_phone: ['', [Validators.minLength(8),Validators.maxLength(8)]],
      zip_code: ['', [Validators.minLength(5),Validators.maxLength(6)]],
	  target_costof_fresh: ['', Validators.required],
      address: [''],
      city: [''],
      state: [''],
	  sui: ['', Validators.required],
	  futa: ['', Validators.required],
	  social_security: ['', Validators.required],
	  medicare: ['', Validators.required],
	  target_percentage: ['', Validators.required],
	  target_costof_goods: ['', Validators.required],
    });

    // get return url from route parameters or default to '/'
    // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
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
        this.f.zip_code.value,this.f.address.value,this.f.city.value,this.f.state.value,this.f.target_percentage.value,this.f.target_costof_goods.value,this.f.target_costof_fresh.value,
          this.f.sui.value,this.f.futa.value,this.f.social_security.value,this.f.medicare.value)
        .pipe(first())
        .subscribe(
            data => {
			  let response = data; 	
			  if(response.status=='error')
			      this.message.sendMessage('error', 'Store Message', response.errors);
			  else
			  {
				  this.message.sendMessage('success', 'Store Message', 'Store created successfully !');
				  this.clean();
				  this.messageService.sendMessageReloadStore();
			  }
			  this.loading = false;
            },
            error => {
			  this.message.sendMessage('error', 'Store Message', error);
              console.log(error);
              //this.error = error;
              this.loading = false;
		});
  }

  clean(){
	 this.f.store_name.setValue('');
     this.f.contact_email.setValue('');
     this.f.contact_phone.setValue('');
     this.f.zip_code.setValue('');
     this.f.address.setValue('');
	 this.f.target_percentage.setValue('');
     this.selectedFile = new ImageSnippet('', null);
     this.submitted = false;
	 this.f.sui.setValue('');
	 this.f.futa.setValue('');
	 this.f.social_security.setValue('');
	 this.f.medicare.setValue('');
	 this.f.target_costof_goods.setValue('');
	 this.f.target_costof_fresh.setValue('');
  }

}
