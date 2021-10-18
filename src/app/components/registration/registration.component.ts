import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import * as countryCallingCodes from '../../../assets/country_calling_codes.json'
import {CountryCode} from "../../models/country-code";
import {AuthService} from "../../services/auth.service";
import {RegisterRequest} from "../../models/registerRequest";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  registrationForm!: FormGroup;
  errorMessage: string = "";
  isSuccess: boolean = false;

  countryCodes: Array<string> = [];
  defaultSelectedCountryCode: string = "";

  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
    let countryCodesData = countryCallingCodes as CountryCode[];
    this.countryCodes = Object.values(countryCodesData)
    .map(code => `${code.countryName} (+${code.countryCode})`)

    let defaultCountryPosition = Object.values(countryCodesData)
    .map(code => code.countryName)
    .indexOf(environment.defaultCountry);
    this.defaultSelectedCountryCode = this.countryCodes[defaultCountryPosition];

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
      countryCode: new FormControl(this.defaultSelectedCountryCode),
      phoneNumber: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[0-9]{6,12}$/)])
    });
  }

  register() {
    this.isSuccess = false;
    this.errorMessage = "";
    this.password?.updateValueAndValidity();
    this.repeatedPassword?.updateValueAndValidity();

    if (!this.registrationForm.valid) {
      this.registrationForm.markAllAsTouched();
      return;
    }

    if (this.password?.value !== this.repeatedPassword?.value) {
      this.registrationForm.markAllAsTouched();
      this.password?.setErrors({'incorrect': true});
      this.repeatedPassword?.setErrors({'incorrect': true});
      this.errorMessage = "Podane hasła nie są takie same";
      return;
    }

    let registerRequest = {
      name: this.name?.value,
      surname: this.surname?.value,
      password: this.password?.value,
      repeatedPassword: this.repeatedPassword?.value,
      email: this.email?.value,
      countryCode: this.countryCode?.value.match(/\+\d+/)[0],
      phoneNumber: this.phoneNumber?.value
    } as RegisterRequest;

    this.authService.register(registerRequest)
    .subscribe(() => {
        this.isSuccess = true;
      },
      error => {
        if (error.status === 409) {
          this.errorMessage = "Podany adres email jest już zajęty";
        } else {
          this.errorMessage = "Wystapił błąd podczas łączenia się z serwerem";
        }
      });
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
}
