import {Component, inject} from '@angular/core';
import {UserService} from "../../../service/userService";
import {HttpClient} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";
import {environment} from "../../../../environments/environment";
import {UserDataResponse, UserResponse} from "../../../utils/models/responses";
import {AuthService} from "../../../register/auth.service";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {Router} from "@angular/router";

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
  private router = inject(Router);
  private cookieService: CookieService = inject(CookieService);
  private baseApiUrl: string = environment.api;
  private authService: AuthService = inject(AuthService);
  public userData: UserDataResponse | null = null

  public form:FormGroup = new FormGroup({
    url : new FormControl(""),
    description : new FormControl(),
    l1name: new FormControl(),
    l2name: new FormControl(),
    l3name: new FormControl(),
    l1url: new FormControl(),
    l2url: new FormControl(),
    l3url: new FormControl(),
  })

  async ngOnInit() {
    this.userData = this.userService.userData;
    console.log(this.userData)
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
    }
    this.form.get("description")?.setValue(this.userData?.About)

    this.form.get("l1name")?.setValue(this.userData?.Links[0].Name)
    this.form.get("l2name")?.setValue(this.userData?.Links[1].Name)
    this.form.get("l3name")?.setValue(this.userData?.Links[2].Name)
    this.form.get("l1url")?.setValue(this.userData?.Links[0].Link)
    this.form.get("l2url")?.setValue(this.userData?.Links[1].Link)
    this.form.get("l3url")?.setValue(this.userData?.Links[2].Link)

    this.form.valueChanges.subscribe((val) => {
      if(val.description.length > 200) {
        this.form.get("description")?.setValue(val.description.slice(0,100))
      }
    })
    this.form.valueChanges.subscribe((val) => {
      if(val.l1name.length > 20) {
        this.form.get("l1name")?.setValue(val.l1name.slice(0,20))
      }
    })
    this.form.valueChanges.subscribe((val) => {
      if(val.l2name.length > 20) {
        this.form.get("l2name")?.setValue(val.l2name.slice(0,20))
      }
    })
    this.form.valueChanges.subscribe((val) => {
      if(val.l3name.length > 20) {
        this.form.get("l3name")?.setValue(val.l3name.slice(0,20))
      }
    })
  }

  saveSettings(){
    this.http.patch(this.baseApiUrl + "/updateUser", {
      "User": this.userData?.User,
      "About":this.form.value.description,
      "Links":[
        {
          Name:this.form.value.l1name,
          Link:this.form.value.l1url,
        },
        {
          Name:this.form.value.l2name,
          Link:this.form.value.l2url,
        },
        {
          Name:this.form.value.l3name,
          Link:this.form.value.l3url,
        },
      ]
    },{
      headers:{
        "Authorization" : this.userService.token
      }
    }).subscribe(res => {
      this.router.navigateByUrl("/profile/"+this.userData?.User);
    })
  }
}
