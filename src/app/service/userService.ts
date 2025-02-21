import {inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";
import {AuthService} from "../register/auth.service";
import {environment} from "../../environments/environment";
import {UserDataResponse, UserResponse} from "../utils/models/responses";
import {ActivatedRoute} from "@angular/router";
import {Observable, of, ReplaySubject, tap} from "rxjs";

@Injectable({
  providedIn: "root",
})

export class UserService {
  http = inject(HttpClient)
  cookieService = inject(CookieService);
  authService = inject(AuthService);
  baseApiUrl = environment.api;
  userData: UserDataResponse | null = null;
  token:string = this.cookieService.get('token');

  constructor() {
    this.token = this.cookieService.get("token")
    if (this.authService.isAuth()) {
      this.getSelfData().subscribe(res => this.userData = res.data.data)
    }
  }

  getSelfData() :Observable<UserResponse>{
    return this.http.get<UserResponse>(this.baseApiUrl + "/getSelf", {
      headers: {
        "Authorization": this.cookieService.get("token"),
      }
    }).pipe(tap(res => {
      this.userData = res.data.data
      this.token = this.cookieService.get("token")
    }))
  }

  getUser(user:string) {
    return this.http.get<UserResponse>(this.baseApiUrl + "/getUser?name="+user, {
      headers: {
        "Authorization": this.token,
      }
    })
  }

  getUserPosts(name: string) {
    return this.http.post<UserResponse>(this.baseApiUrl + "/getUserPosts", {
      User: name
    }, {
      headers: {
        "Authorization": this.token
      }
    })
  }
}
