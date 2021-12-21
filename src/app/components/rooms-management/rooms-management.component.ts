import {Component, OnInit} from '@angular/core';
import {ResortService} from "../../services/resort.service";
import {AuthService} from "../../services/auth.service";
import {DetailedRoomPayload} from "../../models/detailedRoomPayload";
import {ResortPayload} from "../../models/resortPayload";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ConfirmModalComponent} from "../../modals/confirm-modal/confirm-modal.component";
import {RoomService} from "../../services/room.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-rooms-management',
  templateUrl: './rooms-management.component.html',
  styleUrls: ['./rooms-management.component.css']
})
export class RoomsManagementComponent implements OnInit {

  rooms: Array<DetailedRoomPayload> = [];

  constructor(private authService: AuthService,
              private resortService: ResortService,
              private roomService: RoomService,
              private toastr: ToastrService,
              private modalService: NgbModal) {
  }

  ngOnInit(): void {
    let email = this.authService.getEmail();
    this.resortService.getResortsByEmail(email).subscribe(
      resorts => {
        this.getRooms(resorts);
      },
      error => {
        console.log(error);
      });

    setTimeout(() => {
      if (this.rooms.length === 0) {
        this.toastr.error("Brak pokoi");
      }
    }, 1000);

  }

  private getRooms(resorts: Array<ResortPayload>) {
    resorts.forEach((resort) => {
      this.resortService.getResortRooms(resort.resortName).subscribe(
        rooms => {
          rooms.forEach((room) => this.rooms.push(room));
        },
        error => {
          console.log(error);
          this.toastr.error("Wystapił błąd podczas pobierania listy pokoi");
        });
    });
  }

  deleteRoom(room: DetailedRoomPayload) {
    let modalRef = this.modalService.open(ConfirmModalComponent, {centered: true});
    modalRef.componentInstance.question = "Na pewno chcesz usunąc pokój nr " + room.roomNumber + "?";
    modalRef.result.then(result => {
      if (result !== undefined && result !== false) {
        this.roomService.deleteRoom(room.resortName, room.roomNumber).subscribe(
          () => {
            let roomIndex = this.rooms.indexOf(room);
            this.rooms.splice(roomIndex, 1);
            this.toastr.success("Usunięto pokój");
          },
          error => {
            console.log(error);
            if (error.status === 409) {
              this.toastr.error("Nie można usunąć, wybrany pokój ma niezrealizowane rezerwacje");
            }
          });
      }
    });
  }
}
