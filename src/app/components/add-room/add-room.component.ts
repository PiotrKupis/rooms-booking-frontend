import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ResortService} from "../../services/resort.service";
import {AuthService} from "../../services/auth.service";
import {IDropdownSettings} from "ng-multiselect-dropdown";
import {AddRoomRequest} from "../../models/addRoomRequest";
import {ToastrService} from "ngx-toastr";
import {environment} from "../../../environments/environment";
import {RoomService} from "../../services/room.service";

@Component({
  selector: 'app-add-room',
  templateUrl: './add-room.component.html',
  styleUrls: ['./add-room.component.css']
})
export class AddRoomComponent implements OnInit {

  addRoomForm!: FormGroup;
  errorMessage: string = "";
  isSuccess: boolean = false;

  amenities: Array<any> = [];
  dropdownSettings: IDropdownSettings = {};
  selectedAmenities = []

  availableResorts: Array<string> = [];
  singleBedQuantity = 0;
  doubleBedQuantity = 0;
  kingSizeBedQuantity = 0;
  maxResidentsNumber = 0;

  isSelectedImageCorrect = false;
  selectedImage!: File;
  imagesToSend: File[] = [];
  imagesToDisplay: any[] = [];

  constructor(private resortService: ResortService,
              private authService: AuthService,
              private toastr: ToastrService,
              private roomService: RoomService) {
  }

  ngOnInit(): void {

    let email = this.authService.getEmail();
    this.resortService.getResortsByEmail(email)
    .subscribe(data => {
      this.availableResorts = data.map(resort => resort.resortName);
      if (this.availableResorts.length === 0) {
        this.toastr.error("Dodaj najpierw hotel, aby móc dodawać pokoje");
      } else {
        this.resortName?.setValue(this.availableResorts[0]);
      }
    });

    this.amenities = [
      {key: 1, value: 'Klimatyzacja'},
      {key: 2, value: 'Aneks kuchenny'},
      {key: 3, value: 'Kuchnia'},
      {key: 4, value: 'Balkon'},
      {key: 5, value: 'Telewizor'},
      {key: 6, value: 'Pralka'},
      {key: 7, value: 'Netflix'},
      {key: 8, value: 'Prywatna łazienka'},
      {key: 9, value: 'Lodówka'},
      {key: 10, value: 'Mikrofalówka'},
      {key: 11, value: 'Żelazko'}
    ];

    this.dropdownSettings = {
      idField: 'key',
      textField: 'value',
      enableCheckAll: false,
      allowSearchFilter: true,
      searchPlaceholderText: 'Szukaj'
    };

    this.addRoomForm = new FormGroup({
      resortName: new FormControl(''),
      roomNumber: new FormControl(1, [
        Validators.required,
        Validators.min(1),
        Validators.maxLength(10),
        Validators.pattern(/^\d+$/)]),
      price: new FormControl(100, [
        Validators.required,
        Validators.min(1),
        Validators.maxLength(12),
        Validators.pattern(/^(\d+\.\d{1,2})|(\d{1,9})$/)]),
      roomAmenities: new FormControl(this.selectedAmenities)
    })
  }

  public updateSelectedImage(event: any) {
    console.log("Changed selected image");
    const files = event.target.files;
    if (files.length === 0)
      return;

    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.toastr.error("Nieprawidłowy typ pliku");
      return;
    }

    this.isSelectedImageCorrect = true;
    this.selectedImage = files[0];
  }

  uploadImage(element: any) {
    if (this.isSelectedImageCorrect) {
      console.log("Added a new image to list of images");

      this.imagesToSend.push(this.selectedImage);

      let reader = new FileReader();
      reader.readAsDataURL(this.imagesToSend[this.imagesToSend.length - 1]);
      reader.onload = (_event) => {
        this.imagesToDisplay[this.imagesToSend.length - 1] = reader.result;
      }

      this.isSelectedImageCorrect = false;
      element.value = "";
    }
  }

  addRoom() {
    this.isSuccess = false;
    this.errorMessage = "";

    if (!this.addRoomForm.valid) {
      this.addRoomForm.markAllAsTouched();
      return;
    }

    if (this.resortName?.value === '') {
      this.errorMessage = "Brak wybranego hotelu";
      return;
    }

    if (this.singleBedQuantity + this.doubleBedQuantity + this.kingSizeBedQuantity === 0) {
      this.errorMessage = "Pokój musi zawierać przynajmniej jedno łóżko";
      return;
    }

    if (this.maxResidentsNumber === 0) {
      this.errorMessage = "Pokój musi być przeznaczony dla przynajmniej jednej osoby";
      return;
    }

    if (this.imagesToSend.length < 4) {
      this.errorMessage = "Dodaj przynajmniej 4 zdjęcia pokoju, aby móc go dodać";
      return;
    }

    let amenityEnums = [];
    for (let i = 0; i < this.roomAmenities?.value.length; ++i) {
      let amenityEnum = this.convertStringToRoomAmenity(this.roomAmenities?.value[i].value);
      if (amenityEnum !== "UNDEFINED") {
        amenityEnums.push(amenityEnum);
      }
    }

    let addRoomRequest = {
      resortName: this.resortName?.value,
      roomNumber: this.roomNumber?.value,
      price: this.price?.value,
      priceCurrency: environment.defaultCurrency,
      roomAmenities: amenityEnums,
      singleBedQuantity: this.singleBedQuantity,
      doubleBedQuantity: this.doubleBedQuantity,
      kingSizeBedQuantity: this.kingSizeBedQuantity,
      maxResidentsNumber: this.maxResidentsNumber,
    } as AddRoomRequest;

    this.roomService.addRoom(addRoomRequest)
    .subscribe(
      data => {
        // adding images of room
        for (let i = 0; i < this.imagesToSend.length; i++) {
          const uploadImageData = new FormData();
          uploadImageData.append('image', this.imagesToSend[i], this.imagesToSend[i].name);

          this.roomService.addRoomImage(data.resortName, data.roomNumber, uploadImageData)
          .subscribe(() => {
              console.log("Successfully added room image");
            },
            error => {
              console.error(error);
            });
        }

        this.isSuccess = true;
        this.toastr.success("Dodano nowy pokój");
        this.roomNumber?.setValue(100);
        this.price?.setValue(100);
        this.selectedAmenities = [];
        this.singleBedQuantity = 0;
        this.doubleBedQuantity = 0;
        this.kingSizeBedQuantity = 0;
        this.maxResidentsNumber = 0;
        this.imagesToSend = [];
        this.imagesToDisplay = [];
      },
      error => {
        if (error.status === 409) {
          this.errorMessage = "Podany numer pokoju jest już zajęty";
        } else {
          this.errorMessage = "Wystapił błąd podczas łączenia się z serwerem";
        }
      }
    )
  }

  convertStringToRoomAmenity(amenity: string): string {
    return this.roomService.convertStringToRoomAmenity(amenity);
  }

  addSingleBed() {
    if (this.singleBedQuantity < 10) {
      this.singleBedQuantity++;
    }
  }

  subtractSingleBed() {
    if (this.singleBedQuantity > 0) {
      this.singleBedQuantity--;
    }
  }

  addDoubleBed() {
    if (this.doubleBedQuantity < 10) {
      this.doubleBedQuantity++;
    }
  }

  subtractDoubleBed() {
    if (this.doubleBedQuantity > 0) {
      this.doubleBedQuantity--;
    }
  }

  addKingSizeBed() {
    if (this.kingSizeBedQuantity < 10) {
      this.kingSizeBedQuantity++;
    }
  }

  subtractKingSizeBed() {
    if (this.kingSizeBedQuantity > 0) {
      this.kingSizeBedQuantity--;
    }
  }

  addMaxResidentsNumber() {
    if (this.maxResidentsNumber < 20) {
      this.maxResidentsNumber++;
    }
  }

  subtractMaxResidentsNumber() {
    if (this.maxResidentsNumber > 0) {
      this.maxResidentsNumber--;
    }
  }

  get resortName() {
    return this.addRoomForm.get('resortName');
  }

  get roomNumber() {
    return this.addRoomForm.get('roomNumber');
  }

  get price() {
    return this.addRoomForm.get('price');
  }

  get roomAmenities() {
    return this.addRoomForm.get('roomAmenities');
  }
}
