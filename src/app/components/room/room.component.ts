import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {DetailedRoomPayload} from "../../models/detailedRoomPayload";
import {RoomService} from "../../services/room.service";
import {ResortPayload} from "../../models/resortPayload";
import {ReservationPayload} from "../../models/reservationPayload";
import {ResortService} from "../../services/resort.service";
import {ToastrService} from "ngx-toastr";
import {ReservationService} from "../../services/reservation.service";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {

  startDate: string = "01-10-2022";
  endDate: string = "10-10-2022";
  resortName!: string;
  roomNumber!: number;
  isLogged = false;

  room = {
    resortName: "",
    country: "",
    city: "",
    street: "",
    streetNumber: "",
    roomNumber: 0,
    price: "",
    priceCurrency: "",
    roomAmenities: [],
    singleBedQuantity: 0,
    doubleBedQuantity: 0,
    kingSizeBedQuantity: 0,
    maxResidentsNumber: 0,
    photos: []
  } as DetailedRoomPayload;

  resort = {
    resortName: "",
    country: "",
    city: "",
    street: "",
    streetNumber: "",
    resortAmenities: [],
    smokingPermitted: false,
    animalsPermitted: false,
    partyPermitted: false,
    hotelDayStart: "",
    hotelDayEnd: "",
    isParkingAvailable: false,
    parkingFee: "",
    parkingFeeCurrency: "",
  } as ResortPayload;

  constructor(private authService: AuthService,
              private roomService: RoomService,
              private resortService: ResortService,
              private reservationService: ReservationService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.isLogged = this.authService.isLogged();

    this.resortName = String(this.activatedRoute.snapshot.paramMap.get('resortName'));
    this.roomNumber = Number(this.activatedRoute.snapshot.paramMap.get('roomNumber'));

    if (this.resortName === null || this.roomNumber === null || this.startDate === null || this.endDate === null) {
      this.router.navigateByUrl('/');
      this.toastr.error("Wystapił błąd podczas przesyłania danych");
    }

    this.roomService.getRoom(this.resortName, this.roomNumber).subscribe(
      room => {
        this.room = room;
        for (let i = 0; i < this.room.photos.length; ++i) {
          this.room.photos[i].bytes = 'data:image/jpeg;base64,' + this.room.photos[i].bytes;
        }
      },
      () => {
        this.router.navigateByUrl('/rooms');
        this.toastr.error("Wystapił błąd podczas ładowania pokoju");
      }
    );

    this.resortService.getResortByName(this.resortName).subscribe(
      resort => {
        this.resort = resort;
      },
      () => {
        this.router.navigateByUrl('/rooms');
        this.toastr.error("Wystapił błąd podczas ładowania pokoju");
      }
    )
  }

  reserve() {
    if (!this.isLogged) {
      this.toastr.error("Zaloguj się, by móc rezerwować pokoje");
      return;
    }

    let reservationPayload = {
      resortName: this.resortName,
      roomNumber: this.roomNumber,
      startDate: this.startDate,
      endDate: this.endDate
    } as ReservationPayload;

    this.reservationService.addReservation(reservationPayload).subscribe(
      () => {
        this.router.navigateByUrl('/');
        this.toastr.success("Zarezerwowano pokój")
      },
      () => {
        this.toastr.error("Wystąpił błąd podczas rezerwacji pokoju")
      }
    )
  }

  convertRoomAmenityToString(amenityEnum: string): string {
    return this.roomService.convertRoomAmenityToString(amenityEnum);
  }

  convertResortAmenityToString(amenityEnum: string): string {
    return this.resortService.convertResortAmenityToString(amenityEnum);
  }

  isParkingFree(): boolean {
    return Number(this.resort.parkingFee) === 0;
  }
}
