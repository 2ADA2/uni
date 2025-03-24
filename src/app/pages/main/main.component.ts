import {Component, inject} from '@angular/core';
import {RouterLink, RouterOutlet} from "@angular/router";
import {PostComponent} from "../../components/post/post.component";
import {UserService} from "../../service/userService";
import {PostResponse, UserDataResponse, UserResponse} from "../../utils/models/responses";
import {PostcardComponent} from "../../components/postcard/postcard.component";
import {PostService} from "../../service/postService";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faBookmark, faGear, faHeart, faPerson, faUser, faWandMagicSparkles} from "@fortawesome/free-solid-svg-icons";
import {environment} from "../../../environments/environment";

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
  public allPosts !:PostResponse[]
  public fastRecs !:PostResponse[]
  public icon = environment.icon;


  ngOnInit() {
    const interval = setInterval(() => {
      if(this.userService.userData){
        this.userData = this.userService.userData
        this.icon = this.userService.userData.Icon || environment.icon;
      }
    },50)

    this.postService.getPosts().subscribe((res: UserResponse) => {
      this.allPosts = [res.data.data[0], ...res.data.data.slice(4,res.data.length)]
      this.mainPosts = this.allPosts.slice(0,4)
      this.allPosts = this.allPosts.slice(4,res.data.length)
      this.fastRecs = res.data.data.slice(1,4)
    })
  }

  getMore(){
    this.mainPosts = [...this.mainPosts, ...this.allPosts.slice(0,4)]
    this.allPosts = this.allPosts.slice(4,this.allPosts.length)
  }


  protected readonly faUser = faUser;
  protected readonly faHeart = faHeart;
  protected readonly faBookmark = faBookmark;
  protected readonly faWandMagicSparkles = faWandMagicSparkles;
  protected readonly faGear = faGear;
}
