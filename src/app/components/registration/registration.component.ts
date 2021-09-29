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
  countryCodesData: Array<CountryCode> = [];
  countryCodes: Array<string> = [];

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
        Validators.pattern(/^[0-9]{12}$/)])
    });

    this.countryCodesData = countryCallingCodes as CountryCode[];
    for (let i = 0; i < this.countryCodesData.length; ++i) {
      let countryName = this.countryCodesData[i].countryName;
      let countryCode = this.countryCodesData[i].countryCode;
      this.countryCodes.push(`${countryName} (+${countryCode})`);
    }

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
    if (!this.registrationForm.valid) {
      this.registrationForm.markAllAsTouched();
      return;
    }


  }
}
