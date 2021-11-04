import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {ResortPayload} from "../models/resortPayload";

@Injectable({
  providedIn: 'root'
})
export class ResortService {

  path = environment.apiEndpoint + "resort";

  resortAmenities = new Map([
    ["BAR", "Bar"],
    ["SAUNA", "Sauna"],
    ["GARDEN", "Ogród"],
    ["TERRACE", "Taras"],
    ["JACUZZI", "Jacuzzi"],
    ["HEATING", "Ogrzewanie"],
    ["FREE_WIFI", "Darmowe WiFi"],
    ["SWIMMING_POOL", "Basen"],
    ["PARKING", "Parking"],
  ])

  constructor(private http: HttpClient) {
  }

  addResort(addResortPayload: ResortPayload): Observable<any> {
    return this.http.post<ResortPayload>(this.path, addResortPayload);
  }

  getResortsByEmail(email: string): Observable<Array<ResortPayload>> {
    return this.http.get<Array<ResortPayload>>(this.path + "/owner/" + email);
  }

  getResortByName(resortName: string): Observable<ResortPayload> {
    return this.http.get<ResortPayload>(this.path + "/" + resortName);
  }

  convertResortAmenityToString(amenityEnum: string): string {
    if (this.resortAmenities.has(amenityEnum)) {
      return <string>this.resortAmenities.get(amenityEnum);
    } else {
      return "UNDEFINED"
    }
  }

  convertStringToResortAmenity(amenity: string): string {
    for (let [key, value] of this.resortAmenities.entries()) {
      if (value === amenity)
        return key;
    }
    return "UNDEFINED";
  }
}
