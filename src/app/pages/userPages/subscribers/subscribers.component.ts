import {Component, inject} from '@angular/core';
import {AuthorCardComponent} from "../../../components/author-card/author-card.component";
import {UserService} from "../../../service/userService";
import {ActivatedRoute} from "@angular/router";
import {round} from "../../../utils/functions/round";
import {UserDataResponse, UserResponse, UserShortDataResponse} from "../../../utils/models/responses";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {CookieService} from "ngx-cookie-service";
import {AuthService} from "../../../register/auth.service";

@Component({
  selector: 'app-subscribers',
  standalone: true,
  imports: [
    AuthorCardComponent
  ],
  templateUrl: './subscribers.component.html',
  styleUrl: './subscribers.component.scss'
})
export class SubscribersComponent {
  public userService: UserService = inject(UserService);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  public user: string = this.activatedRoute.snapshot.params['user'];
  public subs: UserShortDataResponse[] = []
  private http: HttpClient = inject(HttpClient);
  private baseApiUrl: string = environment.api;
  private cookieService: CookieService = inject(CookieService);
  private authService: AuthService = inject(AuthService);

  async ngOnInit() {
    let userData:UserDataResponse| null = this.userService.userData;
    if(!userData){
      const userResponse = await this.userService.getSelfData().toPromise();
      if(!userResponse) this.authService.logout();
      //@ts-ignore
      userData = userResponse.data.data;
    }
    if (userData?.User) {
      if (userData?.User == this.user) {
        this.getSubs(userData.Followers)
      } else {
        this.userService.getUser(this.user).subscribe(res => {
          this.getSubs(res.data.data.Followers)
        })
      }
    } else{
      this.authService.logout();
    }
  }

  async getSubs(followers: string[]) {
    for (let i of followers) {
      const data: UserResponse | undefined = await this.http.get<UserResponse>(this.baseApiUrl + "/getUser?name=" + i, {
        headers: {
          "Authorization": this.cookieService.get("token")
        }
      }).toPromise();
      if (!data) continue
      this.subs = [...this.subs, data.data.data]
    }
  }

  protected readonly round = round;
}
