import {Routes} from '@angular/router';
import {MainComponent} from "./pages/main/main.component";
import {canActivate, cannotActivate} from "./register/access.guard";
import {LoginComponent} from "./register/login/login.component";
import {RegisterComponent} from "./register/register/register.component";
import {ProfileComponent} from "./pages/profile/profile.component";

export const routes: Routes = [
  {
    path: "", children: [
      {path:"", component: MainComponent},
      {path:"profile/:user", component: ProfileComponent},
    ],
    canActivate: [canActivate],
  },
  {
    path: "", children: [
      {path:"login", component: LoginComponent},
      {path:"register", component: RegisterComponent},
    ],
    canActivate: [cannotActivate],
  }
];
