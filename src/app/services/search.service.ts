import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {DetailedRoomPayload} from "../models/detailedRoomPayload";
import {environment} from "../../environments/environment";
import {SearchPayload} from "../models/searchPayload";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  path = environment.apiEndpoint + "room/search";

  constructor(private http: HttpClient) {
  }

  getNumberOfFoundRooms(searchPayload: SearchPayload): Observable<number> {
    return this.http.post<number>(this.path + "/quantity", searchPayload);
  }

  searchRooms(searchPayload: SearchPayload, pageNumber: number, roomsPerPage: number, imageQuantity: number): Observable<Array<DetailedRoomPayload>> {
    let params = `?page-number=${pageNumber}&rooms-per-page=${roomsPerPage}&image-quantity=${imageQuantity}`;
    return this.http.post<Array<DetailedRoomPayload>>(this.path + params, searchPayload);
  }
}
