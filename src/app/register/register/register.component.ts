import {Component, inject} from '@angular/core';
import {AuthService} from "../auth.service";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";
import {requestError} from "../../utils/errors/requestErrors";
import {UserResponse} from "../../utils/models/responses";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  authService: AuthService = inject(AuthService);
  error : string = ""
  form: FormGroup = new FormGroup({
    name: new FormControl(""),
    password: new FormControl(''),
    password_confirmation: new FormControl('')
  })

  register() {
    this.error = "";
    if(this.form.value.password !== this.form.value.password_confirmation){
      setTimeout(() => {
        this.error = "Passwords do not match";
      },10)
      return;
    } else if(this.form.value.password.length > 20){
      setTimeout(() => {
        this.error = "Password is too long";
      },10)
      return;
    } else if(this.form.value.name.length < 4){
      setTimeout(() => {
        this.error = "Username is too short (4-10)";
      },10)
      return;
    } else if(this.form.value.name.length > 10){
      setTimeout(() => {
        this.error = "Username is too long (4-10)";
      },10)
      return;
    }


    return this.authService.register(
      {
        name: this.form.value.name,
        password: this.form.value.password
      }).subscribe((val) => {
    }, (err) => {
        setTimeout(() => {
          this.error = requestError(err.error)
        },10)
    })
  }
}
