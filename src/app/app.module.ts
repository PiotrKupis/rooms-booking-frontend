import {LOCALE_ID, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {HomeComponent} from './components/home/home.component';
import {AppRoutingModule} from './app-routing.module';
import {HeaderComponent} from './components/header/header.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {RegistrationComponent} from './components/registration/registration.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {LoginComponent} from './components/login/login.component';
import {NgxWebstorageModule} from 'ngx-webstorage';
import {TokenInterceptor} from "./token.interceptor";
import {ToastrModule} from "ngx-toastr";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {AddResortComponent} from './components/add-resort/add-resort.component';
import {NgMultiSelectDropDownModule} from "ng-multiselect-dropdown";
import {AddRoomComponent} from './components/add-room/add-room.component';
import {RoomsComponent} from './components/rooms/rooms.component';
import {RoomComponent} from './components/room/room.component';
import {NgImageSliderModule} from 'ng-image-slider';
import {ChangeRoleComponent} from './components/change-role/change-role.component';
import {RoleModalComponent} from './modals/role-modal/role-modal.component';
import {CreditCardFormComponent} from './modals/credit-card-form/credit-card-form.component';
import {RoomsManagementComponent} from './components/rooms-management/rooms-management.component';
import {ConfirmModalComponent} from './modals/confirm-modal/confirm-modal.component';
import {EditRoomModalComponent} from './modals/edit-room-modal/edit-room-modal.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    RegistrationComponent,
    LoginComponent,
    AddResortComponent,
    AddRoomComponent,
    RoomsComponent,
    RoomComponent,
    ChangeRoleComponent,
    RoleModalComponent,
    CreditCardFormComponent,
    RoomsManagementComponent,
    ConfirmModalComponent,
    EditRoomModalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    NgxWebstorageModule.forRoot(),
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot(),
    NgImageSliderModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {provide: LOCALE_ID, useValue: 'pl-PL'}],
  bootstrap: [AppComponent]
})
export class AppModule {
}
