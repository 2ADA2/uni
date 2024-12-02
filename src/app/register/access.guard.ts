import {inject,} from "@angular/core";
import {AuthService} from "./auth.service";
import {Router} from "@angular/router";

export const canActivate = () => {
  const isLoggedIn:any = inject(AuthService).isAuth()

  if (isLoggedIn) {
    return true

  }
  inject(Router).createUrlTree(["/login"])
  inject(Router).navigate(["/login"])
  return
}

export const cannotActivate = () => {
  const isLoggedIn:any = inject(AuthService).isAuth()

  if (isLoggedIn) {
    return inject(Router).navigate([""])
  }

  return true
}
