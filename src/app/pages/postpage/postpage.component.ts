import {Component, inject} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {PostService} from "../../service/postService";
import {UserService} from "../../service/userService";
import {PostResponse, UserDataResponse, UserResponse} from "../../utils/models/responses";
import {round} from "../../utils/functions/round";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {CookieService} from "ngx-cookie-service";
import {Location, NgStyle} from "@angular/common";

@Component({
  selector: 'app-postpage',
  standalone: true,
  imports: [
    RouterLink,
    NgStyle
  ],
  templateUrl: './postpage.component.html',
  styleUrl: './postpage.component.scss'
})
export class PostpageComponent {
  private postService: PostService = inject(PostService);
  private userService: UserService = inject(UserService);
  private cookieService: CookieService = inject(CookieService);
  private router : Router= inject(Router)
  private activatedRoute : ActivatedRoute = inject(ActivatedRoute)
  private baseApiUrl: string = environment.api;
  private http : HttpClient = inject(HttpClient);
  private location:Location = inject(Location);
  postData !:PostResponse;

  public clickedLike: boolean = false;
  public clickedBookmarks: boolean = false;
  public liked: boolean = false
  public inBookmarks: boolean = false
  public viewed: boolean = false

  public icon: string = environment.icon
    public ID: string = ""

  likesNum: number = 0
  bookmarksNum: number = 0
  viewsNum: number = 0

  likes: number | string = 0
  bookmarks: number | string = 0
  views: number | string = 0

  ngOnInit() {
    if(!this.postService.currentPost || this.postService.currentPost != this.activatedRoute.snapshot.params["id"]){
      this.http.get<UserResponse>(this.baseApiUrl + "/getPost?id="+this.activatedRoute.snapshot.params["id"], {
        headers:{
          "Authorization" : this.cookieService.get("token")
        }
      }).subscribe(res => {
        this.postData = res.data.post
      }, err => {
        this.router.navigateByUrl("/")
      })
    } else{
      this.postData = this.postService.currentPost;
    }
    const interval = setInterval(() => {
      if (this.postData.author) {
        this.likesNum = this.postData.Likes;
        this.bookmarksNum = this.postData.Bookmarks;
        this.viewsNum = this.postData.Views;

        this.likes = round(Number(this.likesNum))
        this.bookmarks = round(Number(this.bookmarksNum))
        this.views = round(Number(this.viewsNum))

        if(this.userService.userData?.User){
          const data: UserDataResponse = this.userService.userData
          const userLikes = data?.Likes
          if (userLikes?.includes(this.postData.ID)) this.liked = true;
          const userBookmarks = data?.Bookmarks
          if (userBookmarks?.includes(this.postData.ID)) this.inBookmarks = true
        } else{
          setTimeout(() => {
            if(!this.userService.userData?.User){
              this.userService.getSelfData().subscribe(res => {
                const data: UserDataResponse = res.data.data
                const userLikes = data?.Likes
                if (userLikes?.includes(this.postData.ID)) this.liked = true;
                const userBookmarks = data?.Bookmarks
                if (userBookmarks?.includes(this.postData.ID)) this.inBookmarks = true
              })
            } else{
              const data: UserDataResponse = this.userService.userData
              const userLikes = data?.Likes
              if (userLikes?.includes(this.postData.ID)) this.liked = true;
              const userBookmarks = data?.Bookmarks
              if (userBookmarks?.includes(this.postData.ID)) this.inBookmarks = true
            }
          },50)

        }
        this.ID = this.postData.ID
        this.icon = this.postData.Icon || environment.icon
        clearInterval(interval)
      }
    }, 10)
  }

  ngAfterViewInit() {
    const interval = setInterval(() => {
      if(this.postData.ID){
        const postElement: HTMLElement | null = document.getElementById(this.postData.ID);
        if (!postElement) return
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              if (!this.viewed) {
                this.view()
              }
            }
          });
        }, {
          threshold: 1.0
        });
        observer.observe(postElement)
        clearInterval(interval)
      }
    },10)
  }

  like() {
    this.postService.like(this.postData.ID)
      .subscribe(res => {
        this.userService.getSelfData().subscribe()
      })
    this.liked = !this.liked
    if (this.liked) {
      this.likesNum++
    } else {
      this.likesNum--
    }
    this.likes = round(this.likesNum)
    this.clickedLike = true;

  }

  addToBookmarks() {
    this.postService.addToBookmarks(this.postData.ID)
      .subscribe(res => {
        this.userService.getSelfData().subscribe()
      })
    this.inBookmarks = !this.inBookmarks
    if (this.inBookmarks) {
      this.bookmarksNum++
    } else {
      this.bookmarksNum--
    }
    this.bookmarks = round(this.bookmarksNum)
    this.clickedBookmarks = true;
    this.userService.getSelfData().subscribe()
  }

  view() {
    let counts: number = 0
    const interval = setInterval(() => {
      if (this.postData.ID) {
        this.postService.view(this.postData.ID)
          .subscribe()
        this.viewed = true
        clearInterval(interval)
      }
      counts += 1
      if (counts >= 5) clearInterval(interval)
    }, 100)
  }

  goBack(): void {
    this.location.back();
  }
}
