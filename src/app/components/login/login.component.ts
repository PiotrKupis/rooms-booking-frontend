import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {LoginRequest} from "../../models/loginRequest";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  errorMessage: string = "";

  constructor(private authService: AuthService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    })
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  login() {
    this.errorMessage = "";
    this.email?.updateValueAndValidity();
    this.password?.updateValueAndValidity();

    if (!this.loginForm.valid) {
      this.loginForm.markAllAsTouched();
      this.errorMessage = "Wprowadź dane"
      return;
    }

    let loginRequest = {
      email: this.email?.value,
      password: this.password?.value
    } as LoginRequest;

    this.authService.login(loginRequest)
    .subscribe(() => {
        console.log("success");
        this.router.navigateByUrl('/');
      },
      error => {
        console.log(error);
        this.errorMessage = "Wprowadzono błędne dane";
        this.email?.setErrors({'incorrect': true});
        this.password?.setErrors({'incorrect': true});
        this.loginForm.markAllAsTouched();
      })
  }
}
