import {Component, inject} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {LayoutComponent} from "./layout/layout.component";
import {UserService} from "./service/userService";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LayoutComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private router: Router = inject(Router);

  ngOnInit() {
    this.router.events.subscribe((event: any) => {
        window.scrollTo(0,0)
      });
  }
}

