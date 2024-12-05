import {Component, inject} from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {AuthService} from "../register/auth.service";

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    RouterOutlet
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
}
