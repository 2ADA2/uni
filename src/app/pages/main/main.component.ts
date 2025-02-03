import {Component, inject} from '@angular/core';
import {RouterLink, RouterOutlet} from "@angular/router";
import {PostComponent} from "../../components/post/post.component";
import {UserService} from "../../service/userService";
import {UserDataResponse} from "../../utils/models/responses";

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
  userService: UserService = inject(UserService);
  userData: UserDataResponse|null = null

  ngOnInit(){
    this.userService.getData()
      .then(res => this.userData = res)
  }
}
