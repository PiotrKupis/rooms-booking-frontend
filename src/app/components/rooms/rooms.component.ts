import {Component, OnInit} from '@angular/core';
import {RoomService} from "../../services/room.service";
import {DetailedRoomPayload} from "../../models/detailedRoomPayload";
import {ToastrService} from "ngx-toastr";
import {ActivatedRoute, Router} from "@angular/router";
import {SearchService} from "../../services/search.service";
import {SearchPayload} from "../../models/searchPayload";

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit {

  rooms: Array<DetailedRoomPayload> = [];
  roomsPerPage: number = 2;
  numberOfPages: number = 0;
  currentPage: number = 1;
  roomImageQuantity = 3;
  searchPayload!: SearchPayload;

  constructor(private roomService: RoomService,
              private searchService: SearchService,
              private toastr: ToastrService,
              private router: Router,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    let location = String(this.activatedRoute.snapshot.paramMap.get('location'));
    let residentsNumber = Number(this.activatedRoute.snapshot.paramMap.get('residentsNumber'));
    let startDate = String(this.activatedRoute.snapshot.paramMap.get('startDate'));
    let endDate = String(this.activatedRoute.snapshot.paramMap.get('endDate'));

    if (location == null || residentsNumber == null || startDate == null || endDate == null) {
      this.router.navigateByUrl('/');
      this.toastr.error("Podano błędne dane");
    }
    this.searchPayload = {
      location: location,
      residentsNumber: residentsNumber,
      startDate: startDate,
      endDate: endDate
    } as SearchPayload;

    this.searchService.getNumberOfFoundRooms(this.searchPayload).subscribe(
      quantity => {
        this.numberOfPages = Math.ceil(Number(quantity) / this.roomsPerPage);
      },
      (error) => {
        console.log(error);
        this.router.navigateByUrl('/');
        if (error.status === 404) {
          this.toastr.error("Brak pokoi");
        } else {
          this.toastr.error("Wystapił błąd podczas pobierania pokoi");
        }
      });

    this.loadRooms();
  }

  private loadRooms() {
    this.searchService.searchRooms(this.searchPayload, this.currentPage, this.roomsPerPage, this.roomImageQuantity).subscribe(
      rooms => {
        this.rooms = rooms;
        for (let i = 0; i < this.rooms.length; ++i) {
          for (let j = 0; j < this.rooms[i].images.length; ++j) {
            this.rooms[i].images[j].bytes = 'data:image/jpeg;base64,' + this.rooms[i].images[j].bytes;
          }
        }

        if (this.rooms.length === 0) {
          this.router.navigateByUrl('/');
          this.toastr.error("Brak dostępnych pokoi")
        }
      },
      (error) => {
        console.log(error);
        this.router.navigateByUrl('/');
        this.toastr.error("Wystapił błąd podczas pobierania pokoi");
      });
  }

  loadPage(pageNumber: number) {
    this.currentPage = pageNumber;
    this.loadRooms();
  }
}
