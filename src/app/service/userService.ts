import {inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";
import {AuthService} from "../register/auth.service";
import {environment} from "../../environments/environment";
import {UserDataResponse, UserResponse} from "../utils/models/responses";

@Injectable({
  providedIn: "root",
})

export class UserService {
  http = inject(HttpClient)
  cookieService = inject(CookieService);
  authService = inject(AuthService);
  baseApiUrl = environment.api;
  userData: UserDataResponse | null = null;
  token: string = "";

  constructor() {
    if (this.cookieService.get("userData")) {
      this.userData = JSON.parse(this.cookieService.get("userData"))
    }
    this.token = this.cookieService.get("token")
  }

  getUser() {
    if (!this.token) {
      this.authService.logout()
    }
    return this.http.get<UserResponse>(this.baseApiUrl + "/getSelf", {
      headers: {
        "Authorization": this.token,
      }
    }).subscribe(res => {
      this.userData = res.data.data
      this.cookieService.set("userData", JSON.stringify(this.userData))
    })
  }

  async getData() {
    if(this.userData) return this.userData
    return new Promise(res => {
      if(!this.userData){
        this.getUser()
        const interval = setInterval(() => {
          if (this.userData) {
            clearInterval(interval)
            res(this.userData)
          }
        }, 100)
      }
    }).then(res => {
      return this.userData
    })
  }
}
