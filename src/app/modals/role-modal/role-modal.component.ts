import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-role-modal',
  templateUrl: './role-modal.component.html',
  styleUrls: ['./role-modal.component.css']
})
export class RoleModalComponent implements OnInit {

  changeRoleForm!: FormGroup;
  roles: Array<string> = ["USER", "MODERATOR", "ADMIN"];
  @Input() currentRole!: string;

  constructor(public activeModal: NgbActiveModal) {
  }

  ngOnInit(): void {
    this.changeRoleForm = new FormGroup({
      selectedRole: new FormControl(this.currentRole),
    })
  }

  get selectedRole() {
    return this.changeRoleForm.get('selectedRole');
  }

  changeRole() {
    this.activeModal.close(this.selectedRole?.value);
  }
}
