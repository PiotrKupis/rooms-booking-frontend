import {Injectable} from '@angular/core';
import {AuthService} from "./services/auth.service";
import {Observable} from "rxjs";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.authService.getJwtToken()}`
      }
    });
    return next.handle(request);
  }
}
