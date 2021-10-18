import {Injectable} from '@angular/core';
import {AddResortPayload} from "../models/add-resort-payload";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ResortService {

  constructor(private http: HttpClient) {
  }

  addResort(addResortPayload: AddResortPayload): Observable<any> {
    return this.http.post<AddResortPayload>(environment.apiEndpoint + "resort", addResortPayload);
  }
}
