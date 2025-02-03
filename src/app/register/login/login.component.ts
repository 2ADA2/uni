import {Component, inject} from '@angular/core';
import {AuthService} from "../auth.service";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {RouterLink} from "@angular/router";
import {requestError} from "../../utils/errors/requestErrors";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  authService: AuthService = inject(AuthService);
  error:string = ""
  form:FormGroup = new FormGroup({
    name: new FormControl(''),
    password: new FormControl('')
  })

  login(){
    this.error = "";
    if(this.form.value.password.length < 6){
      setTimeout(() => {
        this.error = "Password is too short";
      },10)
      return;
    } else if(this.form.value.password.length > 20){
      setTimeout(() => {
        this.error = "Password is too long";
      },10)
      return;
    }

    return this.authService.login(
      {
        name: this.form.value.name,
        password: this.form.value.password
      }).subscribe((val) => {
    }, (err) => {
      setTimeout(() => {
        this.error = requestError(err.error)
        if(this.error === "incorrect") this.error = "Invalid username or password"
      },10)
    })
  }
}
