import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import * as countryCallingCodes from '../../../assets/country_calling_codes.json'
import {CountryCode} from "../../models/country-code";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  registrationForm!: FormGroup;
  countryCodes: Array<string> = [];
  errorMessage: string = "";
  isSuccess: boolean = false;

  constructor() {
  }

  ngOnInit(): void {
    this.registrationForm = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(60)]),
      surname: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(60)]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(200)]),
      repeatedPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(200)]),
      email: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(200),
        Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)]),
      countryCode: new FormControl(""),
      phoneNumber: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[0-9]{6,12}$/)])
    });

    let countryCodesData = countryCallingCodes as CountryCode[];
    for (let i = 0; i < countryCodesData.length; ++i) {
      let countryName = countryCodesData[i].countryName;
      let countryCode = countryCodesData[i].countryCode;
      this.countryCodes.push(`${countryName} (+${countryCode})`);
    }
    this.countryCode?.setValue(this.countryCodes[0]);

    console.log("koniec");
  }

  get name() {
    return this.registrationForm.get('name');
  }

  get surname() {
    return this.registrationForm.get('surname');
  }

  get password() {
    return this.registrationForm.get('password');
  }

  get repeatedPassword() {
    return this.registrationForm.get('repeatedPassword');
  }

  get email() {
    return this.registrationForm.get('email');
  }

  get countryCode() {
    return this.registrationForm.get('countryCode');
  }

  get phoneNumber() {
    return this.registrationForm.get('phoneNumber');
  }

  register() {
    // if (!this.registrationForm.valid) {
    //   this.registrationForm.markAllAsTouched();
    //   return;
    // }

    let registerRequest = {
      name: this.name?.value,
      surname: this.surname?.value,
      password: this.password?.value,
      repeatedPassword: this.repeatedPassword?.value,
      email: this.email?.value,
      countryCode: this.countryCode?.value.match(/\+\d+/)[0],
      phoneNumber: this.phoneNumber?.value,
    }

    console.log(registerRequest.name);

  }
}
