import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {HomeComponent} from "./components/home/home.component";
import {RegistrationComponent} from "./components/registration/registration.component";
import {LoginComponent} from "./components/login/login.component";
import {AddResortComponent} from "./components/add-resort/add-resort.component";
import {AddRoomComponent} from "./components/add-room/add-room.component";
import {RoomsComponent} from "./components/rooms/rooms.component";
import {RoomComponent} from "./components/room/room.component";
import {ChangeRoleComponent} from "./components/change-role/change-role.component";
import {RoomsManagementComponent} from "./components/rooms-management/rooms-management.component";

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'registration', component: RegistrationComponent},
  {path: 'login', component: LoginComponent},
  {path: 'add-resort', component: AddResortComponent},
  {path: 'add-room', component: AddRoomComponent},
  {path: "rooms/:location/:residentsNumber/:startDate/:endDate", component: RoomsComponent},
  {path: "room/:resortName/:roomNumber/:startDate/:endDate", component: RoomComponent},
  {path: "change-role", component: ChangeRoleComponent},
  {path: "rooms/management", component: RoomsManagementComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
