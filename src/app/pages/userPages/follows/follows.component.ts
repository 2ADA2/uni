import {Component, inject} from '@angular/core';
import {AuthorCardComponent} from "../../../components/author-card/author-card.component";
import {ActivatedRoute} from "@angular/router";
import {UserService} from "../../../service/userService";
import {UserDataResponse, UserResponse} from "../../../utils/models/responses";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {CookieService} from "ngx-cookie-service";
import {round} from "../../../utils/functions/round";
import {AuthService} from "../../../register/auth.service";

@Component({
  selector: 'app-follows',
  standalone: true,
  imports: [
    AuthorCardComponent
  ],
  templateUrl: './follows.component.html',
  styleUrl: './follows.component.scss'
})
export class FollowsComponent {
  private router = inject(ActivatedRoute)
  public user = this.router.snapshot.params['user'];
  public userService: UserService = inject(UserService);
  private http:HttpClient = inject(HttpClient);
  private cookieService: CookieService = inject(CookieService);
  private baseApiUrl:string = environment.api
  follows :UserDataResponse[] = [];
  private authService:AuthService = inject(AuthService);

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
        this.getFollows(userData.Subscribes)
      } else{
        this.userService.getUser(this.user).subscribe(res => {
          this.getFollows(res.data.data.Subscribes)
        })
      }
    }
  }

  getFollows(subscribes:string[]){
    for ( let user of subscribes ){
      this.http.get<UserResponse>(this.baseApiUrl+"/getUser?name="+user,{
        headers:{
          "Authorization":this.cookieService.get("token")
        }
      }).subscribe((res) => {
        this.follows = [...this.follows, res.data.data]
      })
    }
  }

  protected readonly round = round;
}
