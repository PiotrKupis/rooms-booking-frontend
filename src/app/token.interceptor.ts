import {Injectable} from '@angular/core';
import {AuthService} from "./services/auth.service";
import {BehaviorSubject, Observable, throwError} from "rxjs";
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from "@angular/common/http";
import {catchError, filter, switchMap, take} from "rxjs/operators";
import {AuthenticationResponse} from "./models/authenticationResponse";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  isTokenRefreshing = false;
  refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private authService: AuthService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    console.log(request.url);
    let jwtToken = this.authService.getJwtToken();

    if (jwtToken) {
      request = this.addToken(request, jwtToken);
      return next.handle(request).pipe(catchError(
        error => {
          if (error instanceof HttpErrorResponse && error.status == 403) {
            return this.handleAuthError(request, next);
          } else {
            console.log("Error occurred");
            console.log(error);
            return throwError(error);
          }
        }
      ));
    }
    return next.handle(request);
  }

  private addToken(request: HttpRequest<any>, jwtToken: any) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${jwtToken}`
      }
    });
  }

  handleAuthError(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isTokenRefreshing) {
      console.log("Refresh token: handle first request");
      this.isTokenRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((authenticationResponse: AuthenticationResponse) => {
          this.isTokenRefreshing = false;
          this.refreshTokenSubject.next(authenticationResponse.authToken);
          return next.handle(this.addToken(request, authenticationResponse.authToken));
        }));
    } else {
      console.log("Token is being refreshed");
      return this.refreshTokenSubject.pipe(
        filter(result => result !== null),
        take(1),
        switchMap(() => {
          console.log("Refresh token: handle rest of requests");
          return next.handle(this.addToken(request, this.authService.getJwtToken()));
        })
      );
    }
  }
}
