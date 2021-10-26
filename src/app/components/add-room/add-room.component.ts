import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-add-room',
  templateUrl: './add-room.component.html',
  styleUrls: ['./add-room.component.css']
})
export class AddRoomComponent implements OnInit {

  addRoomForm!: FormGroup;
  errorMessage: string = "";
  isSuccess: boolean = false;

  selectedAmenities = []

  constructor() {
  }

  ngOnInit(): void {
    this.addRoomForm = new FormGroup({
      resortName: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(150)]),
      roomNumber: new FormControl(1, [
        Validators.required,
        Validators.min(1)]),
      price: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(12),
        Validators.pattern(/^(\d+\.\d{1,2})|(\d{1,9})$/)]),
      priceCurrency: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(3),
        Validators.pattern(/^[A-Z]{3}$/)]),
      roomAmenities: new FormControl(this.selectedAmenities),
      singleBedQuantity: new FormControl(0, [
        Validators.required,
        Validators.min(0)]),
      doubleBedQuantity: new FormControl(0, [
        Validators.required,
        Validators.min(0)]),
      kingSizeBedQuantity: new FormControl(0, [
        Validators.required,
        Validators.min(0)]),
      maxResidentsNumber: new FormControl(0, [
        Validators.required,
        Validators.min(1)]),
    })
  }

}
