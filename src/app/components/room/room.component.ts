import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {DetailedRoomPayload} from "../../models/detailedRoomPayload";
import {RoomService} from "../../services/room.service";
import {ResortPayload} from "../../models/resortPayload";
import {ResortService} from "../../services/resort.service";
import {ToastrService} from "ngx-toastr";
import {AuthService} from "../../services/auth.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {CreditCardFormComponent} from "../../modals/credit-card-form/credit-card-form.component";
import {ReservationPayload} from "../../models/reservationPayload";

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {

  startDate?: string;
  endDate?: string;
  resortName?: string;
  roomNumber?: number;
  isLogged = false;
  images: Array<any> = [];

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
              private modalService: NgbModal,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.isLogged = this.authService.isLogged();

    this.resortName = String(this.activatedRoute.snapshot.paramMap.get('resortName'));
    this.roomNumber = Number(this.activatedRoute.snapshot.paramMap.get('roomNumber'));
    this.startDate = String(this.activatedRoute.snapshot.paramMap.get('startDate'));
    this.endDate = String(this.activatedRoute.snapshot.paramMap.get('endDate'));

    if (this.resortName === null || this.roomNumber === null || this.startDate === null || this.endDate === null) {
      this.router.navigateByUrl('/');
      this.toastr.error("Wystapił błąd podczas przesyłania danych");
    }

    this.roomService.getRoom(this.resortName, this.roomNumber).subscribe(
      room => {
        this.room = room;
        for (let i = 0; i < this.room.photos.length; ++i) {
          let image = {
            image: this.room.photos[i].url,
            thumbImage: this.room.photos[i].url,
          }
          this.images.push(image);
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

  async reserve() {
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

    let modalRef = this.modalService.open(CreditCardFormComponent, {centered: true, size: 'lg'});
    modalRef.componentInstance.reservationPayload = reservationPayload;
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
