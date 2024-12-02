import {Component, inject} from '@angular/core';
import {AuthService} from "../auth.service";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  authService: AuthService = inject(AuthService);
  form = new FormGroup({
    email: new FormControl(""),
    password: new FormControl(''),
    password_confirmation: new FormControl(''),
    name: new FormControl(''),
  })
  register(){
    this.authService.register()
  }
}
