import {Component, inject} from '@angular/core';
import {UserService} from "../../../service/userService";
import {HttpClient} from "@angular/common/http";
import {PostResponse, UserDataResponse, UserResponse} from "../../../utils/models/responses";
import {environment} from "../../../../environments/environment";
import {CookieService} from "ngx-cookie-service";
import {AuthService} from "../../../register/auth.service";
import {PostComponent} from "../../../components/post/post.component";
import {round} from "../../../utils/functions/round";

@Component({
  selector: 'app-bookmarks',
  standalone: true,
  imports: [
    PostComponent
  ],
  templateUrl: './bookmarks.component.html',
  styleUrl: './bookmarks.component.scss'
})
export class BookmarksComponent {
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
    for (let id of userData?.Bookmarks) {
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
      this.postsNum = userData?.Bookmarks.length;
    },1000)
  }

  protected readonly round = round;
}
