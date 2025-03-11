import {Component, inject, Input} from '@angular/core';
import {NgClass, NgOptimizedImage, NgStyle} from "@angular/common";
import {RouterLink} from "@angular/router";
import {round} from "../../utils/functions/round";
import {PostResponse, UserDataResponse} from "../../utils/models/responses";
import {PostService} from "../../service/postService";
import {UserService} from "../../service/userService";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faBucket, faEllipsisV, faX} from "@fortawesome/free-solid-svg-icons";
import {FormsModule} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    RouterLink,
    FaIconComponent,
    NgClass,
    FormsModule,
    NgStyle
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent {
  private postService: PostService = inject(PostService);
  private userService: UserService = inject(UserService);
  private http: HttpClient = inject(HttpClient);
  private cookieService: CookieService = inject(CookieService);
  private baseApiUrl: string = environment.api;
  public imageUrl : string = environment.image;

  @Input() postData: PostResponse = {
    "ID": "",
    "author": "",
    "Icon" : "",
    "Header": "",
    "subs": 0,
    "date": "",
    "text": "",
    "imgUrl": "",
    "Likes": 0,
    "Bookmarks": 0,
    "Views": 0,
  };

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

  public self: boolean = false;
  public optionsOpened:boolean = false;
  public deleteWindow:boolean = false;
  public code:string = String(Math.random()).slice(5,9);
  public inputCode:string = ""

  ngOnInit() {
    const interval = setInterval(() => {
      if (this.postData.author) {
        this.likesNum = this.postData.Likes;
        this.bookmarksNum = this.postData.Bookmarks;
        this.viewsNum = this.postData.Views;

        this.likes = round(Number(this.likesNum))
        this.bookmarks = round(Number(this.bookmarksNum))
        this.views = round(Number(this.viewsNum))

        if (this.userService.userData?.User) {
          const data: UserDataResponse = this.userService.userData
          const userLikes = data?.Likes
          if (userLikes?.includes(this.postData.ID)) this.liked = true;
          const userBookmarks = data?.Bookmarks
          if (userBookmarks?.includes(this.postData.ID)) this.inBookmarks = true
          this.ID = this.postData.ID
          this.self = (this.userService.userData.User === this.postData.author)
          this.icon = this.postData.Icon || environment.icon
          this.imageUrl = this.postData.imgUrl;
          clearInterval(interval)
        }
      }
    }, 10)
  }

  ngAfterViewInit() {
    const interval = setInterval(() => {
      if (this.postData.ID) {
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
    }, 10)
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

  setCurrent() {
    this.postService.setCurrent(this.postData)
  }

  setOptions(){
    this.optionsOpened = !this.optionsOpened
  }

  setDelete(){
    this.deleteWindow = !this.deleteWindow
    if (this.deleteWindow) document.body.style.overflowY="hidden";
    else document.body.style.overflowY="scroll";
  }

  async delete(){
    if (this.inputCode === this.code){
      if(this.postData.imgUrl){
        let res = await this.http.delete(this.baseApiUrl + "/deleteImage?url=" + this.postData.imgUrl, {
          headers: {
            "Authorization" : this.cookieService.get("token")
          }
        }).toPromise()
      }

      let res = this.http.delete(this.baseApiUrl + "/deletePost?id=" + this.postData.ID, {
        headers: {
          "Authorization" : this.cookieService.get("token")
        }
      }).subscribe()

      this.optionsOpened = false
      window.location.reload()
    }
  }

  protected readonly faEllipsisV = faEllipsisV;
  protected readonly faBucket = faBucket;
  protected readonly faX = faX;
}
