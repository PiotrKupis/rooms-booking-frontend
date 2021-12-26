import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {DetailedRoomPayload} from "../../models/detailedRoomPayload";
import {IDropdownSettings} from "ng-multiselect-dropdown";
import {RoomService} from "../../services/room.service";
import {environment} from "../../../environments/environment";
import {AddRoomRequest} from "../../models/addRoomRequest";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-edit-room-modal',
  templateUrl: './edit-room-modal.component.html',
  styleUrls: ['./edit-room-modal.component.css']
})
export class EditRoomModalComponent implements OnInit {

  editRoomForm!: FormGroup;
  @Input() room!: DetailedRoomPayload;
  errorMessage: string = "";

  dropdownSettings: IDropdownSettings = {};
  selectedAmenities: Array<any> = []

  singleBedQuantity = 0;
  doubleBedQuantity = 0;
  kingSizeBedQuantity = 0;
  maxResidentsNumber = 0;

  constructor(public roomService: RoomService,
              private toastr: ToastrService,
              public activeModal: NgbActiveModal) {
  }

  ngOnInit(): void {
    this.singleBedQuantity = this.room.singleBedQuantity;
    this.doubleBedQuantity = this.room.doubleBedQuantity;
    this.kingSizeBedQuantity = this.room.kingSizeBedQuantity;
    this.maxResidentsNumber = this.room.maxResidentsNumber;

    let selected = this.room.roomAmenities.map((amenity) => this.roomService.convertRoomAmenityToString(amenity));
    this.selectedAmenities = selected.map((amenity) => this.roomService.amenitiesDisplayList.find(({value}) => value === amenity))

    this.dropdownSettings = {
      idField: 'key',
      textField: 'value',
      enableCheckAll: false,
      allowSearchFilter: true,
      searchPlaceholderText: 'Szukaj'
    };

    this.editRoomForm = new FormGroup({
      roomNumber: new FormControl(this.room.roomNumber, [
        Validators.required,
        Validators.min(1),
        Validators.maxLength(10),
        Validators.pattern(/^\d+$/)]),
      price: new FormControl(Number(this.room.price).toFixed(2), [
        Validators.required,
        Validators.min(1),
        Validators.maxLength(12),
        Validators.pattern(/^(\d+\.\d{1,2})|(\d{1,9})$/)]),
      roomAmenities: new FormControl(this.selectedAmenities)
    })
  }

  editRoom() {
    this.errorMessage = "";

    if (!this.editRoomForm.valid) {
      this.editRoomForm.markAllAsTouched();
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

    let amenityEnums = [];
    for (let i = 0; i < this.roomAmenities?.value.length; ++i) {
      let amenityEnum = this.roomService.convertStringToRoomAmenity(this.roomAmenities?.value[i].value);
      if (amenityEnum !== "UNDEFINED") {
        amenityEnums.push(amenityEnum);
      }
    }

    let addRoomRequest = {
      resortName: this.room.resortName,
      roomNumber: this.roomNumber?.value,
      price: this.price?.value,
      priceCurrency: environment.defaultCurrency,
      roomAmenities: amenityEnums,
      singleBedQuantity: this.singleBedQuantity,
      doubleBedQuantity: this.doubleBedQuantity,
      kingSizeBedQuantity: this.kingSizeBedQuantity,
      maxResidentsNumber: this.maxResidentsNumber,
    } as AddRoomRequest;

    this.roomService.updateRoom(this.room.resortName, this.room.roomNumber, addRoomRequest).subscribe(
      (roomPayload) => {
        this.activeModal.close(roomPayload);
        this.toastr.success("Pomyślnie zmodyfikowano pokój");
      },
      error => {
        if (error.status === 409) {
          this.errorMessage = "Podany numer pokoju jest już zajęty";
        } else {
          this.errorMessage = "Wystapił błąd podczas łączenia się z serwerem";
        }
      });
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

  get roomNumber() {
    return this.editRoomForm.get('roomNumber');
  }

  get price() {
    return this.editRoomForm.get('price');
  }

  get roomAmenities() {
    return this.editRoomForm.get('roomAmenities');
  }
}
