import {Component, inject} from '@angular/core';
import {AuthorCardComponent} from "../../../components/author-card/author-card.component";
import {ActivatedRoute} from "@angular/router";
import {UserService} from "../../../service/userService";
import {UserDataResponse, UserResponse} from "../../../utils/models/responses";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {CookieService} from "ngx-cookie-service";

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
  private user = this.router.snapshot.params['user'];
  private userService: UserService = inject(UserService);
  private http:HttpClient = inject(HttpClient);
  private cookieService: CookieService = inject(CookieService);
  private baseApiUrl:string = environment.api
  follows :UserDataResponse[] = [];

  ngOnInit() {
    console.log(this.user)
    const interval = setInterval(() => {
      if(this.userService.userData?.User){
        if(this.user == this.userService.userData.User){
          for ( let user of this.userService.userData.Subscribes ){
            this.http.get<UserResponse>(this.baseApiUrl+"/getUser?name="+user,{
              headers:{
                "Authorization":this.cookieService.get("token")
              }
            }).subscribe((res) => {
              this.follows = [...this.follows, res.data.data]
            })
          }

        }

        clearInterval(interval);
      }
    },10)
  }
}
