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

  startDate?: string;
  endDate?: string;

  rooms: Array<DetailedRoomPayload> = [];
  roomsPerPage: number = 5;
  numberOfPages: number = 0;
  currentPage: number = 1;
  photosPerRoom = 3;
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
    this.startDate = String(this.activatedRoute.snapshot.paramMap.get('startDate'));
    this.endDate = String(this.activatedRoute.snapshot.paramMap.get('endDate'));

    if (location == null || residentsNumber == null || this.startDate == null || this.endDate == null) {
      this.router.navigateByUrl('/');
      this.toastr.error("Podano błędne dane");
    }
    this.searchPayload = {
      location: location,
      residentsNumber: residentsNumber,
      startDate: this.startDate,
      endDate: this.endDate
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
    this.searchService.searchRooms(this.searchPayload, this.currentPage, this.roomsPerPage, this.photosPerRoom).subscribe(
      rooms => {
        this.rooms = rooms;

        if (this.rooms.length === 0) {
          this.router.navigateByUrl('/');
          this.toastr.error("Brak dostępnych pokoi")
        }
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
  }

  loadPage(pageNumber: number) {
    this.currentPage = pageNumber;
    this.loadRooms();
  }
}
