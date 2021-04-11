import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterModel } from './singup';
import { SingupService } from './singup.service';
declare var $: any;
declare var jQuery: any;
@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.scss'],
})
export class SignupPageComponent implements OnInit {
  userData: [] = [];
  registerUser = this.fb.group(
    {
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    },
    {
      validator: this.passwordMatchValidator('password', 'confirmPassword'),
    }
  );
  constructor(
    public translate: TranslateService,
    private registerService: SingupService,
    private fb: FormBuilder,
    private route: Router
  ) {
    translate.addLangs(['en', 'ar']);
    translate.setDefaultLang('en');
  }

  ngOnInit(): void {
    this.changeLang('ar');
    {
      $('.container-fluid').addClass('makeItRight');
    }

    const submit = document.getElementById('submit');

    submit.addEventListener('click', validate);

    function validate(e) {
      e.preventDefault();
      const email = document.getElementById('inputEmail');
      const address = document.getElementById('inputAddress');
      const firstName = document.getElementById('inputUserame');
      const lastName = document.getElementById('inputUserame2');
      const password = document.getElementById('inputPassword');
      const confirmPassword = document.getElementById('inputConfirmPassword');
      const phone = document.getElementById('inputPhone');
      let valid = true;

      if (!(<HTMLInputElement>firstName).value) {
        const NameError = document.getElementById('NameError');
        NameError.classList.add('visible');
        firstName.classList.add('invalid');
        NameError.setAttribute('aria-hidden', 'false');
        NameError.setAttribute('aria-invalid', 'true');
        valid = false;
      }
      if (!(<HTMLInputElement>lastName).value) {
        const NameError2 = document.getElementById('NameError2');
        NameError2.classList.add('visible');
        lastName.classList.add('invalid');
        NameError2.setAttribute('aria-hidden', 'false');
        NameError2.setAttribute('aria-invalid', 'true');
        valid = false;
      }
      if (!(<HTMLInputElement>password).value) {
        const PasswordError = document.getElementById('PasswordError');
        PasswordError.classList.add('visible');
        password.classList.add('invalid');
        PasswordError.setAttribute('aria-hidden', 'false');
        PasswordError.setAttribute('aria-invalid', 'true');
        valid = false;
      }
      if (!(<HTMLInputElement>confirmPassword).value) {
        const PasswordConfirmError = document.getElementById(
          'PasswordConfirmError'
        );
        PasswordConfirmError.classList.add('visible');
        confirmPassword.classList.add('invalid');
        PasswordConfirmError.setAttribute('aria-hidden', 'false');
        PasswordConfirmError.setAttribute('aria-invalid', 'true');
        valid = false;
      }
      if (!(<HTMLInputElement>phone).value) {
        const PhoneError = document.getElementById('PhoneError');
        PhoneError.classList.add('visible');
        phone.classList.add('invalid');
        PhoneError.setAttribute('aria-hidden', 'false');
        PhoneError.setAttribute('aria-invalid', 'true');
        valid = false;
      }
      if (
        (<HTMLInputElement>password).value !=
        (<HTMLInputElement>confirmPassword).value
      ) {
        (<HTMLInputElement>confirmPassword).setCustomValidity(
          "Passwords Don't Match"
        );
        valid = false;
      } else {
        (<HTMLInputElement>confirmPassword).setCustomValidity('');
      }

      if (valid) {
      }
      return valid;
    }
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
  get firstName() {
    return this.registerUser.get('firstName');
  }
  get lastName() {
    return this.registerUser.get('lastName');
  }
  get phone() {
    return this.registerUser.get('phone');
  }
  get password() {
    return this.registerUser.get('password');
  }
  get confirmPassword() {
    return this.registerUser.get('confirmPassword');
  }

  passwordMatchValidator(password: string, confirmPassword: string) {
    return (formGroup: FormGroup) => {
      const passwordControl = formGroup.controls[password];
      const confirmPasswordControl = formGroup.controls[confirmPassword];

      if (!passwordControl || !confirmPasswordControl) {
        return null;
      }

      if (
        confirmPasswordControl.errors &&
        !confirmPasswordControl.errors.passwordMismatch
      ) {
        return null;
      }

      if (passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({ passwordMismatch: true });
      } else {
        confirmPasswordControl.setErrors(null);
      }
    };
  }

  async RegisterUser(): Promise<any> {
    let data;
    let message;
    let user = new RegisterModel();
    user.firstName = $('#inputUserame').val();
    user.lastName = $('#inputUserame2').val();
    user.email = $('#Email').val();
    user.phone = String($('#inputPhone').val());
    user.address = $('#Address').val();
    user.password = $('#inputPassword').val();
    user.confirmPassword = $('#inputConfirmPassword').val();
    let userData = await this.registerService.RegisterUser(user);
    this.checkData(userData)
  }

  checkData(data: any) {
    if (data == "User is already exist") {
      $('#error').show();
    }
    else {
      //localStorage.setItem('userData', JSON.stringify(data));
      this.route.navigate(['/Registration/Login']);
    }
  }

}
