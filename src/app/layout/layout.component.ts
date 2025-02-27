import {Component, inject} from '@angular/core';
import {Router, RouterLink, RouterOutlet} from "@angular/router";
import {AuthService} from "../register/auth.service";
import {NgClass} from "@angular/common";
import {UserService} from "../service/userService";
import {UserDataResponse} from "../utils/models/responses";
import {FormsModule} from "@angular/forms";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faBars, faSearch, faX} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    NgClass,
    FormsModule,
    FaIconComponent
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  private authService: AuthService = inject(AuthService);
  public userService: UserService = inject(UserService);
  user : UserDataResponse | null = null
  isAuth =  this.authService.isAuth()
  router:Router = inject(Router)
  route:string = ""
  public followers:number = 0;
  public isSearch : boolean = false;
  public searchValue = ""

  menu:boolean=false

  ngOnInit(){
    this.router.events.subscribe((event:any) => {
      this.route = event.url
      this.isAuth =  this.authService.isAuth()
    })
  }

  logout(){
    this.authService.logout()
    this.isAuth =  this.authService.isAuth()
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

  setSearch(){
    this.isSearch = !this.isSearch
    if (this.isSearch) document.body.style.overflowY="hidden";
    if (!this.isSearch) document.body.style.overflowY="scroll";
  }

  search(){
    alert(this.searchValue)
  }

  protected readonly faSearch = faSearch;
  protected readonly faBars = faBars;
  protected readonly faX = faX;
}
