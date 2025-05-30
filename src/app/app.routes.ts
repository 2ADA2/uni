import {Routes} from '@angular/router';
import {MainComponent} from "./pages/main/main.component";
import {canActivate, cannotActivate} from "./register/access.guard";
import {LoginComponent} from "./register/login/login.component";
import {RegisterComponent} from "./register/register/register.component";
import {ProfileComponent} from "./pages/profile/profile.component";
import {CreatorComponent} from "./pages/userPages/creator/creator.component";
import {SettingsComponent} from "./pages/userPages/settings/settings.component";
import {BookmarksComponent} from "./pages/userPages/bookmarks/bookmarks.component";
import {LikesComponent} from "./pages/userPages/likes/likes.component";
import {FollowsComponent} from "./pages/userPages/follows/follows.component";
import {SubscribersComponent} from "./pages/userPages/subscribers/subscribers.component";
import {PostpageComponent} from "./pages/postpage/postpage.component";

export const routes: Routes = [
  {
    path: "", children: [
      {path:"", component: MainComponent},
      {path:"creator", component: CreatorComponent},
      {path:"likes", component: LikesComponent},
      {path:"bookmarks", component: BookmarksComponent},
      {path:"settings", component: SettingsComponent},
      {path:"subscribers/:user", component: SubscribersComponent},
      {path:"follows/:user", component: FollowsComponent},
      {path:"profile/:user", component: ProfileComponent},
      {path:"post/:id", component: PostpageComponent},
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
