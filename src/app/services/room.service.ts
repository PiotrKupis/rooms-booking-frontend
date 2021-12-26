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

  private roomAmenities = new Map([
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

  private _amenitiesDisplayList = [
    {key: 1, value: 'Klimatyzacja'},
    {key: 2, value: 'Aneks kuchenny'},
    {key: 3, value: 'Kuchnia'},
    {key: 4, value: 'Balkon'},
    {key: 5, value: 'Telewizor'},
    {key: 6, value: 'Pralka'},
    {key: 7, value: 'Netflix'},
    {key: 8, value: 'Prywatna łazienka'},
    {key: 9, value: 'Lodówka'},
    {key: 10, value: 'Mikrofalówka'},
    {key: 11, value: 'Żelazko'}
  ];

  constructor(private http: HttpClient) {
  }

  addRoom(addRoomRequest: AddRoomRequest): Observable<RoomPayload> {
    return this.http.post<RoomPayload>(this.path, addRoomRequest);
  }

  getAllRooms(photoQuantity: number): Observable<Array<DetailedRoomPayload>> {
    return this.http.get<Array<DetailedRoomPayload>>(this.path + "?photo-quantity=" + photoQuantity);
  }

  getRoom(resortName: string, roomNumber: number): Observable<DetailedRoomPayload> {
    return this.http.get<DetailedRoomPayload>(this.path + "/" + resortName + "/" + roomNumber);
  }

  updateRoom(resortName: string, roomNumber: number, addRoomRequest: AddRoomRequest): Observable<RoomPayload> {
    return this.http.put<RoomPayload>(this.path + "/" + resortName + "/" + roomNumber, addRoomRequest);
  }

  deleteRoom(resortName: string, roomNumber: number): Observable<string> {
    return this.http.delete<string>(this.path + "/" + resortName + "/" + roomNumber);
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

  get amenitiesDisplayList() {
    return this._amenitiesDisplayList
  }
}
