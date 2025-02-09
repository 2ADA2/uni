import {inject, Injectable} from "@angular/core";
import {UserService} from "./userService";
import {HttpClient} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";
import {environment} from "../../environments/environment";
import {UserResponse} from "../utils/models/responses";

@Injectable({
  providedIn: 'root',
})

export class PostService {
  private userService: UserService = inject(UserService);
  private http: HttpClient = inject(HttpClient);
  private cookieService = inject(CookieService);
  private token: string = "";
  private baseApiUrl: string = environment.api;

  constructor() {
    this.token = this.cookieService.get("token");
    this.getPosts()
  }

  getPosts() {
    if (!this.token) {
      this.token = this.cookieService.get("token");
    }
    return this.http.get<UserResponse>(this.baseApiUrl + "/getPosts", {
        headers: {
          "Authorization": this.token
        }
      }
    )
  }
}
