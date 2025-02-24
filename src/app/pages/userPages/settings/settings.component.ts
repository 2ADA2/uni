import {Component, inject} from '@angular/core';
import {UserService} from "../../../service/userService";
import {HttpClient} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";
import {environment} from "../../../../environments/environment";
import {UserDataResponse, UserResponse} from "../../../utils/models/responses";
import {AuthService} from "../../../register/auth.service";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  private userService: UserService = inject(UserService);
  private http = inject(HttpClient);
  private cookieService: CookieService = inject(CookieService);
  private baseApiUrl: string = environment.api;
  private authService: AuthService = inject(AuthService);
  public userData: UserDataResponse | null = null

  public form:FormGroup = new FormGroup({
    url : new FormControl(""),
    description : new FormControl(),
  })

  async ngOnInit() {
    this.userData = this.userService.userData;
    if (!this.userData) {
      const data = await this.http.get<UserResponse>(this.baseApiUrl + "/getSelf", {
        headers: {
          "Authorization": this.userService.token
        }
      }).toPromise();
      if (!data) {
        this.authService.logout()
      }
      //@ts-ignore
      this.userData = data.data.data;
      this.form.get("description")?.setValue(this.userData?.About)
    }

    this.form.valueChanges.subscribe((val) => {
      if(val.description.length > 200) {
        this.form.get("description")?.setValue(val.description.slice(0,100))
      }
    })
  }
}
