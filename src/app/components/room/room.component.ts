import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {DetailedRoomPayload} from "../../models/detailedRoomPayload";
import {RoomService} from "../../services/room.service";
import {ResortPayload} from "../../models/resortPayload";
import {ResortService} from "../../services/resort.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {

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
    images: []
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

  constructor(private roomService: RoomService,
              private resortService: ResortService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private toastr: ToastrService) {
  }

  ngOnInit(): void {
    let resortName = String(this.activatedRoute.snapshot.paramMap.get('resortName'));
    let roomNumber = Number(this.activatedRoute.snapshot.paramMap.get('roomNumber'));

    this.roomService.getRoom(resortName, roomNumber).subscribe(
      room => {
        this.room = room;
        for (let i = 0; i < this.room.images.length; ++i) {
          this.room.images[i].bytes = 'data:image/jpeg;base64,' + this.room.images[i].bytes;
        }
      },
      () => {
        this.router.navigateByUrl('/rooms');
        this.toastr.error("Wystapił błąd podczas ładowania pokoju")
      }
    );

    this.resortService.getResortByName(resortName).subscribe(
      resort => {
        this.resort = resort;
      },
      () => {
        this.router.navigateByUrl('/rooms');
        this.toastr.error("Wystapił błąd podczas ładowania pokoju")
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
