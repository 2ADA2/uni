import {Component, inject} from '@angular/core';
import {AuthorCardComponent} from "../../../components/author-card/author-card.component";
import {PostComponent} from "../../../components/post/post.component";
import {PostResponse, UserDataResponse, UserResponse} from "../../../utils/models/responses";
import {HttpClient} from "@angular/common/http";
import {UserService} from "../../../service/userService";
import {environment} from "../../../../environments/environment";
import {round} from "../../../utils/functions/round";
import {CookieService} from "ngx-cookie-service";
import {AuthService} from "../../../register/auth.service";

@Component({
  selector: 'app-likes',
  standalone: true,
  imports: [
    PostComponent
  ],
  templateUrl: './likes.component.html',
  styleUrl: './likes.component.scss'
})
export class LikesComponent {
  private userService: UserService = inject(UserService);
  private http: HttpClient = inject(HttpClient);
  public posts: PostResponse[] = [];
  private baseApiUrl: string = environment.api;
  private cookieService: CookieService = inject(CookieService);
  private authSerivce: AuthService = inject(AuthService);
  public postsNum: number = 0;

  async ngOnInit() {
    let userData:UserDataResponse | null = null
    if(!this.userService.userData?.User){
      const userResponse : UserResponse | undefined = await this.userService.getSelfData().toPromise();
      if(!userResponse){
        this.authSerivce.logout()
      }
      userData = userResponse!.data.data
    } else{
      userData = this.userService.userData
    }

    //@ts-ignore
    for (let id of userData.Likes) {
      const post: UserResponse | undefined = await this.http.get<UserResponse>(this.baseApiUrl + "/getPost?id=" + id, {
        headers: {
          "Authorization": this.cookieService.get("token")
        }
      }).toPromise()
      if (!post) continue
      this.posts = [...this.posts, post.data.post];
      this.postsNum++
    }
    setTimeout(() => {
      //@ts-ignore
      this.postsNum = userData.Likes.length;
    },1000)
  }

  protected readonly round = round;
}
