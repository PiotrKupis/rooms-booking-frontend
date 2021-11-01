import {Component, OnInit} from '@angular/core';
import {RoomService} from "../../services/room.service";
import {DetailedRoomPayload} from "../../models/detailedRoomPayload";

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit {

  rooms: Array<DetailedRoomPayload> = [];

  constructor(private roomService: RoomService) {
  }

  ngOnInit(): void {

    this.roomService.getAllRooms().subscribe(
      rooms => {
        this.rooms = rooms;
        for (let i = 0; i < this.rooms.length; ++i) {
          for (let j = 0; j < this.rooms[i].images.length; ++j) {
            this.rooms[i].images[j].bytes = 'data:image/jpeg;base64,' + this.rooms[i].images[j].bytes;
          }
        }
      },
      error => {
        console.log(error);
      }
    )

  }

}
