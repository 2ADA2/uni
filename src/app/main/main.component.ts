import {Component, inject} from '@angular/core';
import {RouterLink, RouterOutlet} from "@angular/router";
import {AuthService} from "../register/auth.service";
import {PostComponent} from "../components/post/post.component";

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    RouterOutlet,
    PostComponent,
    RouterLink
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
  authService: AuthService = inject(AuthService);
  name = this.authService.name
}
