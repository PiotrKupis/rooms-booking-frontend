import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  private _isLogged = false;
  private email?: string;
  private _role?: string

  constructor(private authService: AuthService,
              private router: Router,
              private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.authService._isLogged.subscribe(isLogged => this._isLogged = isLogged);
    this.authService.email.subscribe(email => this.email = email);
    this.authService.role.subscribe(role => this._role = role);

    this._isLogged = this.authService.isLogged();
    this.email = this.authService.getEmail();
    this._role = this.authService.getRole();
  }

  get isLogged() {
    return this._isLogged;
  }

  set isLogged(value: boolean) {
    this._isLogged = value;
  }

  get role() {
    return this._role;
  }

  logout() {
    this.authService.logout();
    this.isLogged = false;
    this.router.navigateByUrl('/');
    this.toastr.success("Zostałeś wylogowany");
  }
}
