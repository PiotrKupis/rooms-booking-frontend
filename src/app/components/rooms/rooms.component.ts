import {Component, OnInit} from '@angular/core';
import {RoomService} from "../../services/room.service";
import {ImagePayload} from "../../models/imagePayload";

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit {

  image = {
    name: '',
    type: '',
    bytes: ''
  } as ImagePayload;
  is = false;

  constructor(private roomService: RoomService) {
  }

  ngOnInit(): void {
    this.roomService.getRoomImages("Studio Rental Central Warszawa1", 210).subscribe(
      images => {
        this.is = true;
        this.image.name = images.name;
        this.image.type = images.type;
        this.image.bytes = 'data:image/jpeg;base64,' + images.bytes;
      },
      error => {
        console.log(error);
      }
    )
  }

}
