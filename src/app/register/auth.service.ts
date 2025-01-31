import {inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";
import {environment} from "../../environments/environment";
import {Router} from "@angular/router";

@Injectable({
  providedIn: "root",
})

export class AuthService {
  http: HttpClient = inject(HttpClient);
  baseApiUrl: string = environment.api + "/api/auth/";
  token: string | null = null;
  cookieService = inject(CookieService);
  router = inject(Router);
  name = "ada"

  isAuth(): boolean {
    if (!this.token) {
      this.token = this.cookieService.get("token")
    }
    return !!this.token;
  }

  logout(){
    this.token = null;
    this.cookieService.delete("token")
    this.router.navigate(["/login"]);
  }

  login(){
    this.token = "123"
    this.cookieService.set("token","123")
    this.router.navigate(["/"])
  }

  register(){
    this.token = "123"
    this.cookieService.set("token","123")
    this.router.navigate(["/"])
  }
}
