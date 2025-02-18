import {Component, inject} from '@angular/core';
import {Router, RouterLink, RouterOutlet} from "@angular/router";
import {AuthService} from "../register/auth.service";
import {NgClass} from "@angular/common";
import {UserService} from "../service/userService";
import {UserDataResponse} from "../utils/models/responses";

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    NgClass
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
      this.userService.getSelfData().subscribe(res => this.user = res.data.data)
    }
  }
}
