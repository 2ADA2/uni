import {inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";
import {environment} from "../../environments/environment";
import {PostResponse, UserResponse} from "../utils/models/responses";

@Injectable({
  providedIn: 'root',
})

export class PostService {
  private http: HttpClient = inject(HttpClient);
  private cookieService = inject(CookieService);
  private baseApiUrl: string = environment.api;
  public currentPost :PostResponse | null = null;

  constructor() {
    this.getPosts()
  }

  getPosts() {
    return this.http.get<UserResponse>(this.baseApiUrl + "/getPosts", {
      headers: {
        "Authorization": this.cookieService.get("token")
      }
    })
  }

  like(id:string){
    return this.http.post(this.baseApiUrl + "/like", {
      ID:id,
    },{
      headers:{
        "Authorization": this.cookieService.get("token")
      }
    })
  }

  addToBookmarks(id:string){
    return this.http.post(this.baseApiUrl + "/bookmark", {
      ID:id,
    },{
      headers:{
        "Authorization": this.cookieService.get("token")
      }
    })
  }

  view(id:string){
    return this.http.post(this.baseApiUrl + "/view", {
      ID:id,
    },{
      headers:{
        "Authorization": this.cookieService.get("token")
      }
    })
  }

  repost(id:string){
    return this.http.post(this.baseApiUrl + "/repost", {
      ID:id,
    }, {
      headers:{
        "Authorization": this.cookieService.get("token")
      }
    })
  }

  setCurrent (post:PostResponse){
    this.currentPost = post
  }
}
