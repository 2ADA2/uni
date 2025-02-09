import {inject, Injectable} from "@angular/core";
import {UserService} from "./userService";

@Injectable({
  providedIn: 'root',
})

class PostService {
  private userService: UserService = inject(UserService);

}
