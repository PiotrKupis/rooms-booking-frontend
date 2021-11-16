import {Injectable} from '@angular/core';
import {ReservationPayload} from "../models/reservationPayload";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  path = environment.apiEndpoint + "reservation";

  constructor(private http: HttpClient) {
  }

  addReservation(reservationPayload: ReservationPayload): Observable<ReservationPayload> {
    return this.http.post<ReservationPayload>(this.path, reservationPayload);
  }
}
