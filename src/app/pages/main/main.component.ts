import {Component, inject} from '@angular/core';
import {RouterLink, RouterOutlet} from "@angular/router";
import {PostComponent} from "../../components/post/post.component";
import {UserService} from "../../service/userService";
import {PostResponse, UserDataResponse, UserResponse} from "../../utils/models/responses";
import {PostcardComponent} from "../../components/postcard/postcard.component";
import {PostService} from "../../service/postService";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faBookmark, faGear, faHeart, faPerson, faUser, faWandMagicSparkles} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    PostComponent,
    RouterLink,
    PostcardComponent,
    FaIconComponent
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})

export class MainComponent {
  userService: UserService = inject(UserService);
  userData: UserDataResponse | null = null
  private postService: PostService = inject(PostService);
  public mainPosts !:PostResponse[]
  public fastRecs !:PostResponse[]


  ngOnInit() {
    if (this.userService.userData) {
      this.userData = this.userService.userData
    } else {
      this.userService.getSelfData().subscribe(res => this.userData = res.data.data)
    }

    this.postService.getPosts().subscribe((res: UserResponse) => {
      this.mainPosts = res.data.data.slice(4,res.data.length)
      this.fastRecs = res.data.data.slice(0,4)
    })


  }

  protected readonly faUser = faUser;
  protected readonly faHeart = faHeart;
  protected readonly faBookmark = faBookmark;
  protected readonly faWandMagicSparkles = faWandMagicSparkles;
  protected readonly faGear = faGear;
}
