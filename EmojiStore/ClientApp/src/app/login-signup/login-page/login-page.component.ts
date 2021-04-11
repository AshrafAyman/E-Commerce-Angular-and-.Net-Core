import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterModel } from './../signup-page/singup';
import { SingupService } from './../signup-page/singup.service';
import { LoginModel } from './login-model';
import { Observable } from 'rxjs';
declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent implements OnInit {
  userData = {};
  registerUser = this.fb.group({
    phone: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });
  constructor(
    public translate: TranslateService,
    private registerService: SingupService,
    private fb: FormBuilder,
    private route: Router
  ) {
    translate.addLangs(['en', 'ar']);
    translate.setDefaultLang('en');

    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|ar/) ? browserLang : 'en');
  }
  ngOnInit(): void {
    this.changeLang('ar');
    {
      $('.container-fluid').addClass('makeItRight');
    }
    const submit = document.getElementById('submit');
  }
  imgSelect: string[];

  changeLang(value) {
    this.translate.use(value);
    if (value == 'en') {
      this.imgSelect = ['./assets/img/8en.svg'];
      $('.container-fluid').removeClass('makeItRight');
    } else {
      this.imgSelect = ['./assets/img/7ar.svg'];
      $('.container-fluid').addClass('makeItRight');
    }
  }
  get phone() {
    return this.registerUser.get('phone');
  }
  get password() {
    return this.registerUser.get('password');
  }

  async LoginUser(): Promise<any> {
    let isSuccess;
    let message;
    let user = new LoginModel();
    user.phone = String($('#inputPhone').val());
    user.password = $('#inputPassword').val();
    let userData = await this.registerService.LoginUser(user);
    this.checkResult(userData);
    //  this.registerService.LoginUser(user).then((e) => {
    //     (isSuccess = e.isSucess),
    //     (message = e.message),
    //     error(isSuccess),
    //     (this.userData = e)
    //   });
  }
  checkResult(data: any) {
    if (data == false) {
      $('#error').show();
    }
    if (data.customer.role == "NormalUser") {
      localStorage.setItem('userData', JSON.stringify(data));
      this.route.navigate(['/Home']);
    }
    else {
      localStorage.setItem('userData', JSON.stringify(data));
      this.route.navigate(['/Admin/OverView']);
    }
  }
}
