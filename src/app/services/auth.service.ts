import {Injectable} from '@angular/core';
import {RegisterRequest} from "../models/RegisterRequest";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {
  }

  register(registerRequest: RegisterRequest): Observable<any> {
    return this.http.post<RegisterRequest>(environment.apiEndpoint + "auth/register", registerRequest);
  }
}
