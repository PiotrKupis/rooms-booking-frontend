import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  private isLogged?: boolean;
  private email?: string;
  private role?: string;

  constructor() {
  }

  ngOnInit(): void {
    this.isLogged = false;
    this.email = "jan@gmail.com";
    this.role = "USER";
  }

  get IsLogged() {
    return this.isLogged;
  }

  get Role() {
    return this.role;
  }

}
