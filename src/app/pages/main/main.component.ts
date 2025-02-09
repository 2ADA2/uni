import {Component, inject} from '@angular/core';
import {RouterLink, RouterOutlet} from "@angular/router";
import {PostComponent} from "../../components/post/post.component";
import {UserService} from "../../service/userService";
import {PostResponse, UserDataResponse, UserResponse} from "../../utils/models/responses";
import {PostcardComponent} from "../../components/postcard/postcard.component";
import {PostService} from "../../service/postService";

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    RouterOutlet,
    PostComponent,
    RouterLink,
    PostcardComponent
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})

export class MainComponent {
  userService: UserService = inject(UserService);
  userData: UserDataResponse|null = null
  private postService: PostService = inject(PostService);
  public mainPosts : PostResponse[] = [{
    "ID": "",
    "author": "",
    "subs": 0,
    "date": "",
    "text": "",
    "imgUrl": "",
    "Likes": 0,
    "Bookmarks": 0,
    "Views": 0,
  }]


  ngOnInit(){
    this.userService.getData()
      .then(res => this.userData = res)

    this.postService.getPosts().subscribe((res:UserResponse) => {
      this.mainPosts = res.data.data
    })
  }
}
