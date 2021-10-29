import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AddRoomRequest} from "../models/addRoomRequest";
import {Observable} from "rxjs";
import {RoomPayload} from "../models/roomPayload";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  path = environment.apiEndpoint + "room";

  constructor(private http: HttpClient) {
  }

  addRoom(addRoomRequest: AddRoomRequest): Observable<RoomPayload> {
    return this.http.post<RoomPayload>(this.path, addRoomRequest);
  }

  addRoomImage(resortName: string, roomNumber: number, image: FormData): Observable<string> {
    return this.http.post<string>(this.path + "/" + resortName + "/" + roomNumber, image);
  }
}
