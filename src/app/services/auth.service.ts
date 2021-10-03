import {EventEmitter, Injectable, Output} from '@angular/core';
import {RegisterRequest} from "../models/registerRequest";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {LoginRequest} from "../models/loginRequest";
import {LoginResponse} from "../models/loginResponse";
import {map} from "rxjs/operators";
import {LocalStorageService} from "ngx-webstorage";
import {RefreshTokenPayload} from "../models/refreshTokenPayload";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  @Output() _isLogged: EventEmitter<boolean> = new EventEmitter();
  @Output() email: EventEmitter<string> = new EventEmitter();
  @Output() roles: EventEmitter<Array<string>> = new EventEmitter();

  constructor(private http: HttpClient,
              private localStorage: LocalStorageService) {
  }

  getJwtToken() {
    return this.localStorage.retrieve('authToken');
  }

  getRefreshToken() {
    return this.localStorage.retrieve('refreshToken');
  }

  getEmail() {
    return this.localStorage.retrieve('email');
  }

  getRoles() {
    return JSON.parse(this.localStorage.retrieve('roles'));
  }

  isLogged() {
    return this.getJwtToken() != null;
  }

  register(registerRequest: RegisterRequest): Observable<any> {
    return this.http.post<RegisterRequest>(environment.apiEndpoint + "auth/register", registerRequest);
  }

  login(loginRequest: LoginRequest): Observable<any> {
    return this.http.post<LoginResponse>(environment.apiEndpoint + "auth/login", loginRequest).pipe(
      map(loginResponse => {
        this.localStorage.store('authToken', loginResponse.authToken);
        this.localStorage.store('refreshToken', loginResponse.refreshToken);
        this.localStorage.store('expireDate', loginResponse.expireDate);
        this.localStorage.store('email', loginResponse.email);
        this.localStorage.store('roles', JSON.stringify(loginResponse.roles));

        this._isLogged.emit(true);
        this.email.emit(loginResponse.email);
        this.roles.emit(loginResponse.roles);
        return true;
      })
    );
  }

  logout() {
    let refreshTokenPayload = {
      refreshToken: this.getRefreshToken(),
      email: this.getEmail()
    } as RefreshTokenPayload;

    this.http.post(environment.apiEndpoint + "auth/logout", refreshTokenPayload)
    .subscribe(() => {
      console.log("Logged out");
    },
    error => {
      console.error(error);
    })

    this.localStorage.clear('authToken');
    this.localStorage.clear('refreshToken');
    this.localStorage.clear('expireDate');
    this.localStorage.clear('email');
    this.localStorage.clear('roles');
  }
}
