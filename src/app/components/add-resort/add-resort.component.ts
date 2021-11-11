import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import * as countryCallingCodes from "../../../assets/country_calling_codes.json";
import {CountryCode} from "../../models/country-code";
import {IDropdownSettings} from "ng-multiselect-dropdown";
import {environment} from "../../../environments/environment";
import {ResortService} from "../../services/resort.service";
import {ToastrService} from "ngx-toastr";
import {ResortPayload} from "../../models/resortPayload";

@Component({
  selector: 'app-add-resort',
  templateUrl: './add-resort.component.html',
  styleUrls: ['./add-resort.component.css']
})
export class AddResortComponent implements OnInit {

  addResortForm!: FormGroup;
  errorMessage: string = "";
  isSuccess: boolean = false;
  step: number = 1;

  countries: Array<string> = [];
  defaultSelectedCountry = environment.defaultCountry;

  amenities: Array<any> = [];
  dropdownSettings: IDropdownSettings = {};
  selectedAmenities = []

  checkInHours: Array<string> = [];
  defaultCheckInHour = "15:00";

  checkOutHours: Array<string> = [];
  defaultCheckOutHour = "10:00";

  defaultParkingOption = "unavailable";
  defaultParkingFee = "20";

  constructor(private resortService: ResortService,
              private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.countries = Object.values(countryCallingCodes as CountryCode[])
    .map(code => code.countryName);

    this.checkInHours = Array.from(new Array(10), (x, i) => i + 13)
    .map(hour => this.formatHour(hour));

    this.checkOutHours = Array.from(new Array(6), (x, i) => i + 9)
    .map(hour => this.formatHour(hour));

    this.amenities = [
      {key: 1, value: 'Bar'},
      {key: 2, value: 'Sauna'},
      {key: 3, value: 'Ogród'},
      {key: 4, value: 'Taras'},
      {key: 5, value: 'Jacuzzi'},
      {key: 6, value: 'Ogrzewanie'},
      {key: 7, value: 'Darmowe WiFi"'},
      {key: 8, value: 'Basen'},
      {key: 9, value: 'Parking'}
    ];

    this.dropdownSettings = {
      idField: 'key',
      textField: 'value',
      enableCheckAll: false,
      allowSearchFilter: true,
      searchPlaceholderText: 'Szukaj'
    };

    this.addResortForm = new FormGroup({
      resortName: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(150)]),
      country: new FormControl(this.defaultSelectedCountry),
      city: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(80)]),
      street: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)]),
      streetNumber: new FormControl('', [
        Validators.required,
        Validators.maxLength(60)]),
      resortAmenities: new FormControl(this.selectedAmenities),
      smokingPermitted: new FormControl(false),
      animalsPermitted: new FormControl(false),
      partyPermitted: new FormControl(false),
      hotelDayStart: new FormControl(this.defaultCheckInHour),
      hotelDayEnd: new FormControl(this.defaultCheckOutHour),
      isParkingAvailable: new FormControl(this.defaultParkingOption),
      parkingFee: new FormControl(this.defaultParkingFee)
    })
  }

  addResort() {
    this.isSuccess = false;
    this.errorMessage = "";
    this.parkingFee?.updateValueAndValidity();

    if (!this.addResortForm.valid) {
      this.addResortForm.markAllAsTouched();
      this.errorMessage = "Podano nieprawidłowe dane";
      return;
    }

    if (this.isParkingAvailable?.value === "paid") {
      if (this.parkingFee?.value === null || this.parkingFee?.value.length === 0) {
        this.parkingFee?.setErrors({'incorrect': true})
        this.parkingFee?.setErrors({'required': true})
        return;
      }

      let pattern = /^(\d+\.\d{1,2})$|^(\d{1,9})$/;
      if (!pattern.test(this.parkingFee?.value)) {
        this.parkingFee?.setErrors({'incorrect': true})
        this.parkingFee?.setErrors({'pattern': true})
        return;
      }
    }

    let parkingAvailable = true;
    if (this.isParkingAvailable?.value === "unavailable") {
      parkingAvailable = false;
    }

    let parkingFee = "0";
    if (this.isParkingAvailable?.value === "paid") {
      parkingFee = this.parkingFee?.value;
    }

    let amenityEnums = [];
    for (let i = 0; i < this.resortAmenities?.value.length; ++i) {
      let amenityEnum = this.convertStringToResortAmenity(this.resortAmenities?.value[i].value);
      if (amenityEnum !== "UNDEFINED") {
        amenityEnums.push(amenityEnum);
      }
    }

    let addResortPayload = {
      resortName: this.resortName?.value,
      country: this.country?.value,
      city: this.city?.value,
      street: this.street?.value,
      streetNumber: this.streetNumber?.value,
      resortAmenities: amenityEnums,
      smokingPermitted: this.smokingPermitted?.value,
      animalsPermitted: this.animalsPermitted?.value,
      partyPermitted: this.partyPermitted?.value,
      hotelDayStart: this.hotelDayStart?.value,
      hotelDayEnd: this.hotelDayEnd?.value,
      isParkingAvailable: parkingAvailable,
      parkingFee: parkingFee,
      parkingFeeCurrency: environment.defaultCurrency
    } as ResortPayload;
    console.log(addResortPayload);

    this.resortService.addResort(addResortPayload)
    .subscribe(() => {
          this.isSuccess = true;
          this.toastr.success("Dodano nowy ośrodek");
          this.addResortForm.reset();
          this.selectedAmenities = [];
        },
        error => {
          if (error.status === 409) {
            this.errorMessage = "Podana nazwa ośrodka jest już zajęta";
          } else {
            this.errorMessage = "Wystapił błąd podczas łączenia się z serwerem";
          }
        });
  }

  formatHour(hour: number): string {
    let formattedHour = hour + "";
    if (hour < 10) {
      formattedHour = "0" + formattedHour;
    }
    return formattedHour + ":00";
  }

  continue() {
    this.step = this.step + 1;
  }

  backward() {
    this.step = this.step - 1;
  }

  convertStringToResortAmenity(amenity: string): string {
    return this.resortService.convertStringToResortAmenity(amenity);
  }

  get resortName() {
    return this.addResortForm.get('resortName');
  }

  get country() {
    return this.addResortForm.get('country');
  }

  get city() {
    return this.addResortForm.get('city');
  }

  get street() {
    return this.addResortForm.get('street');
  }

  get streetNumber() {
    return this.addResortForm.get('streetNumber');
  }

  get resortAmenities() {
    return this.addResortForm.get('resortAmenities');
  }

  get smokingPermitted() {
    return this.addResortForm.get('smokingPermitted');
  }

  get animalsPermitted() {
    return this.addResortForm.get('animalsPermitted');
  }

  get partyPermitted() {
    return this.addResortForm.get('partyPermitted');
  }

  get hotelDayStart() {
    return this.addResortForm.get('hotelDayStart');
  }

  get hotelDayEnd() {
    return this.addResortForm.get('hotelDayEnd');
  }

  get isParkingAvailable() {
    return this.addResortForm.get('isParkingAvailable');
  }

  get parkingFee() {
    return this.addResortForm.get('parkingFee');
  }
}
