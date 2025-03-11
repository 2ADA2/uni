import {Component, inject} from '@angular/core';
import {Router, RouterLink, RouterOutlet} from "@angular/router";
import {AuthService} from "../register/auth.service";
import {NgClass} from "@angular/common";
import {UserService} from "../service/userService";
import {UserDataResponse, UserResponse} from "../utils/models/responses";
import {FormsModule} from "@angular/forms";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faBars, faSearch, faX} from "@fortawesome/free-solid-svg-icons";
import {HttpClient} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";
import {environment} from "../../environments/environment";
import {UserInfo} from "node:os";
import {PostComponent} from "../components/post/post.component";
import {AuthorCardComponent} from "../components/author-card/author-card.component";

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    NgClass,
    FormsModule,
    FaIconComponent,
    PostComponent,
    AuthorCardComponent
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  private authService: AuthService = inject(AuthService);
  private http: HttpClient = inject(HttpClient);
  private cookieService: CookieService = inject(CookieService);
  private baseApiUrl: string = environment.api;

  public userService: UserService = inject(UserService);
  user : UserDataResponse | null = null
  icon = environment.icon
  isAuth =  this.authService.isAuth()
  router:Router = inject(Router)
  route:string = ""
  public followers:number = 0;
  public isSearch : boolean = false;
  public searchValue = ""

  public postResults:any[] = []
  public userResults:any[] = []

  menu:boolean=false

  ngOnInit(){
    this.router.events.subscribe((event:any) => {
      this.route = event.url
      this.isAuth =  this.authService.isAuth()
    })
  }

  logout(){
    this.authService.logout()
    this.isAuth =  false
    this.menu=false
  }

  setMenu(){
    this.menu = !this.menu
    if(!this.user){
      if(this.userService.userData){
        this.user = this.userService.userData
        this.followers = this.user.Followers.length
        return
      }
      this.userService.getSelfData().subscribe(res => this.user = res.data.data)
    }
  }

  checkKey(event:KeyboardEvent){
    if(event.keyCode == 13) this.search();
  }

  setSearch(){
    this.isSearch = !this.isSearch
    if (this.isSearch) document.body.style.overflowY="hidden";
    if (!this.isSearch) {
      this.searchValue = ""
      this.postResults = []
      this.userResults = []
      document.body.style.overflowY = "scroll";
    }
  }

  search(){
    this.userResults = []
    this.postResults = []
    if(!this.searchValue) return;

    this.http.get<UserResponse>(this.baseApiUrl + "/search?searchValue=" + this.searchValue, {
      headers:{
        "Authorization" : this.cookieService.get("token")
      }
    }).subscribe(res => {
      for(let i of res.data.data){
        if(i.Header){
          this.postResults = [...this.postResults, i]
        } else{
          this.userResults = [...this.userResults, i]
        }
      }
    })
  }

  protected readonly faSearch = faSearch;
  protected readonly faBars = faBars;
  protected readonly faX = faX;
}
