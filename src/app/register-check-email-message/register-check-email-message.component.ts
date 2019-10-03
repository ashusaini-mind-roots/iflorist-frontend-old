import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-register-check-email-message',
  templateUrl: './register-check-email-message.component.html',
  styleUrls: ['./register-check-email-message.component.less']
})
export class RegisterCheckEmailMessageComponent implements OnInit {

  private email:string;
  constructor(private activateRoute: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    document.body.classList.add('bg-login-img');

    this.activateRoute.params.subscribe(params=>{
      // console.log("params.email)
      this.email = params.email;
    });
  }

}
