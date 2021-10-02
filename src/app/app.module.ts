import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {HomeComponent} from './components/home/home.component';
import {AppRoutingModule} from './app-routing.module';
import {HeaderComponent} from './components/header/header.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {RegistrationComponent} from './components/registration/registration.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {LoginComponent} from './components/login/login.component';
import {NgxWebstorageModule} from 'ngx-webstorage';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    RegistrationComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    NgxWebstorageModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
