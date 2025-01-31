import {Component, inject} from '@angular/core';
import {PostComponent} from "../../components/post/post.component";
import {RouterLink} from "@angular/router";
import {AuthService} from "../../register/auth.service";

@Component({
  selector: 'app-popular',
  standalone: true,
  imports: [
    PostComponent,
    RouterLink
  ],
  templateUrl: './popular.component.html',
  styleUrl: './popular.component.scss'
})
export class PopularComponent {
  authService: AuthService = inject(AuthService);
  name = this.authService.name
}
