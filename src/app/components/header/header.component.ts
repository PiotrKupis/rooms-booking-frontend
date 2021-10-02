import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  private _isLogged?: boolean;
  private email?: string;
  private _roles?: Array<string>;

  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
    this.authService._isLogged.subscribe(isLogged => this._isLogged = isLogged);
    this.authService.email.subscribe(email => this.email = email);
    this.authService.roles.subscribe(roles => this._roles = roles);

    this._isLogged = this.authService.isLogged();
    this.email = this.authService.getEmail();
    this._roles = this.authService.getRoles();
  }

  get isLogged() {
    return this._isLogged;
  }

  get roles() {
    return this._roles;
  }

}
