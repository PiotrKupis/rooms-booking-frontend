import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {UserPayload} from "../models/userPayload";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  path = environment.apiEndpoint + "user";

  constructor(private http: HttpClient) {
  }

  getAllUsers(): Observable<Array<UserPayload>> {
    return this.http.get<Array<UserPayload>>(this.path);
  }

  changeRole(email: string, role: string): Observable<UserPayload> {
    return this.http.put<UserPayload>(this.path + "/" + email + "/" + role, null);
  }


}
