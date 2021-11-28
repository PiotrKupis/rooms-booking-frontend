import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {PhotoPayload} from "../models/photoPayload";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  constructor(private http: HttpClient) {
  }

  addRoomPhoto(resortName: string, roomNumber: number, photo: FormData): Observable<string> {
    return this.http.post<string>(environment.apiEndpoint + resortName + "/" + roomNumber + "/photo", photo);
  }

  getRoomPhotos(resortName: string, roomNumber: number): Observable<Array<PhotoPayload>> {
    return this.http.get<Array<PhotoPayload>>(environment.apiEndpoint + resortName + "/" + roomNumber + "/photo");
  }
}
