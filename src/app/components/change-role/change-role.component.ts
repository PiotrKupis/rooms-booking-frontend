import {Component, OnInit} from '@angular/core';
import {UserService} from "../../services/user.service";
import {UserPayload} from "../../models/userPayload";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {RoleModalComponent} from "../../modals/role-modal/role-modal.component";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-change-role',
  templateUrl: './change-role.component.html',
  styleUrls: ['./change-role.component.css']
})
export class ChangeRoleComponent implements OnInit {

  users: Array<UserPayload> = [];

  constructor(private userService: UserService,
              private modalService: NgbModal,
              private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe(
      users => {
        this.users = users;
      },
      error => {
        console.log(error);
        this.toastr.error("Wystąpił błąd podczas pobierania listy użytkowników");
      }
    )
  }

  openModal(user: UserPayload) {
    let modalRef = this.modalService.open(RoleModalComponent, {centered: true});
    modalRef.componentInstance.currentRole = user.role;
    modalRef.result.then(newRole => {
      if (newRole !== undefined && newRole !== user.role) {
        this.userService.changeRole(user.email, newRole).subscribe(
          () => {
            this.toastr.success("Zmieniono role użytkownika");
            let userIndex = this.users.indexOf(user);
            this.users[userIndex].role = newRole;
          },
          error => {
            console.log(error);
            this.toastr.error("Wystąpił błąd podczas zmiany uprawnień użytkownika");
          }
        );
      }
    });
  }
}
