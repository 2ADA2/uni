import {Component, inject} from '@angular/core';
import {ActivatedRoute, RouterLink} from "@angular/router";
import {PostComponent} from "../../components/post/post.component";
import {UserService} from "../../service/userService";
import {PostcardComponent} from "../../components/postcard/postcard.component";
import {PostResponse, UserDataResponse, UserResponse} from "../../utils/models/responses";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {
  faBookmark,
  faGear,
  faHeart,
  faImage,
  faLink,
  faPen,
  faPeopleGroup,
  faRepeat
} from "@fortawesome/free-solid-svg-icons";
import {Location, NgClass, NgStyle} from "@angular/common";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {CookieService} from "ngx-cookie-service";
import {PostService} from "../../service/postService";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    PostComponent,
    PostcardComponent,
    FaIconComponent,
    NgClass,
    RouterLink,
    NgStyle
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})

export class ProfileComponent {
  private router: ActivatedRoute = inject(ActivatedRoute);
  private http: HttpClient = inject(HttpClient);
  private baseApiUrl: string = environment.api;
  private postServise: PostService = inject(PostService);
  private cookieService: CookieService = inject(CookieService);

  public userService: UserService = inject(UserService);
  public name: string = this.router.snapshot.params['user'];
  public icon: string = environment.icon
  public subs: number | string = 0
  public followers: number | string = 0
  public self: boolean = false;
  public userData: UserDataResponse | null = null
  public subscribed: boolean = false;

  private selfUserData: UserDataResponse | null = null
  public fastRecs !: PostResponse[]
  public posts: PostResponse[] = [];
  public userPosts: PostResponse[] = [];
  public userResposts: PostResponse[] = [];

  public content:string = "posts"

  constructor() {
    this.userService.getSelfData().subscribe(res => {
      const userData: UserDataResponse = res.data.data
      if (userData.User === this.name) {
        this.self = true
        this.userData = res.data.data
        this.subs = this.userData!.Subscribes.length;
        this.followers = this.userData!.Followers.length
        this.icon = this.userData!.Icon;
      } else {
        this.userService.getUser(this.name).subscribe(user => {
          this.userData = user.data.data
          this.subs = this.userData!.Subscribes.length;
          this.followers = this.userData!.Followers.length
          this.icon = this.userData!.Icon || environment.icon;
        })
      }
      this.selfUserData = userData
      if (this.selfUserData?.Subscribes.includes(this.name)) {
        this.subscribed = true;
      }
    });
  }

  ngOnInit() {
    this.userService.getUserPosts(this.name).subscribe(res => {
      this.userPosts = res.data.posts
      this.posts = res.data.posts
    })
    this.postServise.getPosts().subscribe((res: UserResponse) => {
      this.fastRecs = res.data.data.slice(0, 4)
    })
  }

  round(num: number): string {
    let str: string
    if (num > 1000000000) {
      str = (num / 1000000000).toFixed(1)
      return str + "B"
    } else if (num > 1000000) {
      str = (num / 1000000).toFixed(1)
      return str + "M"
    } else if (num > 1000) {
      str = (num / 1000).toFixed(1)
      return str + "K"
    }

    return String(num)
  }

  subscribeUser() {
    this.http.post(this.baseApiUrl + "/subscribe", {
      "Author": this.userData?.User
    }, {
      headers: {
        "Authorization": this.cookieService.get("token")
      }
    }).subscribe(res => {
      this.subscribed = !this.subscribed
    })
  }

  async setContent(value: string) {
    this.content = value;
    if(this.content == "posts") {
      this.posts = this.userPosts
    }
    if(this.content == "reposts") {
      if(!this.userResposts.length) {
        if(!this.userData?.Reposts){
          this.posts = []
          return
        }
        for(let id of this.userData!.Reposts){
          const res = await this.http.get<UserResponse>(this.baseApiUrl + "/getPost?id=" + id, {
            headers: {
              "Authorization": this.cookieService.get("token")
            }
          }).toPromise()
          if(!res) continue
          this.userResposts = [...this.userResposts, res.data.post]
          this.posts = this.userResposts.reverse()
        }
      }
      this.posts = this.userResposts
    }
  }

  protected readonly faPeopleGroup = faPeopleGroup;
  protected readonly faGear = faGear;
  protected readonly faBookmark = faBookmark;
  protected readonly faHeart = faHeart;
  protected readonly faPen = faPen;
  protected readonly faLink = faLink;
  protected readonly faImage = faImage;
  protected readonly faRepeat = faRepeat;
}
