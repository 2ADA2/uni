import {inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";
import {environment} from "../../environments/environment";
import {Router} from "@angular/router";
import {tap} from "rxjs";
import {UserResponse} from "../utils/models/responses";

@Injectable({
  providedIn: "root",
})

export class AuthService {
  http: HttpClient = inject(HttpClient);
  baseApiUrl: string = environment.api;
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

  logout() {
    this.token = null;
    this.cookieService.delete("token")
    this.cookieService.delete("userData")
    this.router.navigateByUrl("/login");
  }

  login(payload: { name: string, password: string }) {
    let fd: FormData = new FormData()
    fd.append("name", payload.name)
    fd.append("password", payload.password)
    return this.http.post<UserResponse>(this.baseApiUrl + "/login", fd).pipe(tap((val) => {
      const token = val.data.Token
      this.token = token
      this.cookieService.set("token", token)
      this.router.navigate(["/"])
    }))
  }

  register(payload: { name: string, password: string }) {
    let fd: FormData = new FormData()
    fd.append("name", payload.name)
    fd.append("password", payload.password)
    // @ts-ignore
    return this.http.post<UserResponse>(this.baseApiUrl + "/register", fd).pipe(tap((val) => {
      this.router.navigate(["/"])
    }))
  }
}


