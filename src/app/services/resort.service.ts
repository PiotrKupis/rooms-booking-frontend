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

  constructor(private http: HttpClient) {
  }

  addResort(addResortPayload: ResortPayload): Observable<any> {
    return this.http.post<ResortPayload>(this.path, addResortPayload);
  }

  getResortsByEmail(email: string): Observable<Array<ResortPayload>> {
    return this.http.get<Array<ResortPayload>>(this.path + "/" + email);
  }
}
