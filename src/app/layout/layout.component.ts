import {Component, inject} from '@angular/core';
import {Router, RouterLink, RouterOutlet} from "@angular/router";
import {AuthService} from "../register/auth.service";
import {NgClass} from "@angular/common";

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
  isAuth =  this.authService.isAuth()
  router:Router = inject(Router)
  route:string = ""

  menu:boolean=false

  ngOnInit(){
    this.router.events.subscribe((event:any) => {
      this.route = event.url
      this.isAuth =  this.authService.isAuth()
      // console.log(this.route)
    })
  }

  logout(){
    this.authService.logout()
    this.isAuth =  this.authService.isAuth()
  }

  setMenu(){
    this.menu = !this.menu
  }
}
