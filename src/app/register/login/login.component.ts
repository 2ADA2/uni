import {Component, inject} from '@angular/core';
import {AuthService} from "../auth.service";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  authService: AuthService = inject(AuthService);
  form:FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  })

  login(){
    this.authService.login()
  }
}
