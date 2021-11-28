import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AddRoomRequest} from "../models/addRoomRequest";
import {Observable} from "rxjs";
import {RoomPayload} from "../models/roomPayload";
import {environment} from "../../environments/environment";
import {DetailedRoomPayload} from "../models/detailedRoomPayload";

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  path = environment.apiEndpoint + "room";

  roomAmenities = new Map([
    ["AIR_CONDITIONING", "Klimatyzacja"],
    ["KITCHENETTE", "Aneks kuchenny"],
    ["KITCHEN", "Kuchnia"],
    ["BALCONY", "Balkon"],
    ["TV", "Telewizor"],
    ["WASHER", "Pralka"],
    ["NETFLIX", "Netflix"],
    ["PRIVATE_BATHROOM", "Prywatna łazienka"],
    ["FRIDGE", "Lodówka"],
    ["MICROWAVE", "Mikrofalówka"],
    ["IRON", "Żelazko"]
  ])

  constructor(private http: HttpClient) {
  }

  addRoom(addRoomRequest: AddRoomRequest): Observable<RoomPayload> {
    return this.http.post<RoomPayload>(this.path, addRoomRequest);
  }

  getAllRooms(imageQuantity: number): Observable<Array<DetailedRoomPayload>> {
    return this.http.get<Array<DetailedRoomPayload>>(this.path + "?image-quantity=" + imageQuantity);
  }

  getRoom(resortName: string, roomNumber: number): Observable<DetailedRoomPayload> {
    return this.http.get<DetailedRoomPayload>(this.path + "/" + resortName + "/" + roomNumber);
  }

  convertRoomAmenityToString(amenityEnum: string): string {
    if (this.roomAmenities.has(amenityEnum)) {
      return <string>this.roomAmenities.get(amenityEnum);
    } else {
      return "UNDEFINED"
    }
  }

  convertStringToRoomAmenity(amenity: string): string {
    for (let [key, value] of this.roomAmenities.entries()) {
      if (value === amenity)
        return key;
    }
    return "UNDEFINED";
  }
}
