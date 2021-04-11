import { Component, OnInit } from '@angular/core';
import {
  Validators,
  FormBuilder,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { Router } from '@angular/router';
import { SingupService } from 'src/app/login-signup/signup-page/singup.service';
import { Customer } from 'src/app/shared/Customer';
import { UserService } from './user.service';
import { ChangeUserData } from './UserModel';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  userData = [];
  userName;
  userProfileGroup = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required)
  });
  constructor(
    private registerService: SingupService,
    private fb: FormBuilder,
    private userService: UserService,
    private route: Router
  ) { }

  ngOnInit(): void {
    this.userProfile();
    // const submit = document.getElementById('submit');
    // submit.addEventListener('click', validate);
    // function validate(e) {
    //   let valid = true;
    //   if (valid) {
    //   }
    //   return valid;
    // }
  }
  get firstName() {
    return this.userProfileGroup.get('firstName');
  }
  get lastName() {
    return this.userProfileGroup.get('lastName');
  }
  get phone() {
    return this.userProfileGroup.get('phone');
  }
  userProfile() {
    var userData = JSON.parse(localStorage.getItem('userData'));
    if (userData != null) {
      this.userProfileGroup.setValue({
        firstName: userData.customer.firstName,
        lastName: userData.customer.lastName,
        phone: userData.customer.phone,
      });
      $("#Email").val(userData.customer.email);
      $("#Address").val(userData.customer.address);
      $("#userId").text(userData.customer.userId);
      $("#token").text(userData.token);
      $("#role").text(userData.customer.role);
    }
  }

  async ChangeUserData(): Promise<any> {
    let user = new ChangeUserData();
    user.userId = $("#userId").text();
    user.email = String($("#Email").val());
    user.address = String($("#Address").val());
    user.firstName = this.userProfileGroup.controls.firstName.value;
    user.lastName = this.userProfileGroup.controls.lastName.value;
    user.phone = this.userProfileGroup.controls.phone.value;
    user.token = $("#token").text();
    let result = await this.userService.EditUserData(user);
    localStorage.setItem('userData', JSON.stringify(result));
    this.userProfile();

  }

}
