import {Component, ElementRef, inject, ViewChild} from '@angular/core';
import {UserService} from "../../../service/userService";
import {HttpClient} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";
import {environment} from "../../../../environments/environment";
import {UserDataResponse, UserResponse} from "../../../utils/models/responses";
import {AuthService} from "../../../register/auth.service";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {Router} from "@angular/router";
import {throwError} from "../../../utils/errors/requestErrors";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faSquareCaretUp, faSquareUpRight, faUpload} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FaIconComponent
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  @ViewChild("file", {static: true}) file!: ElementRef<HTMLInputElement>;

  private userService: UserService = inject(UserService);
  private http = inject(HttpClient);
  private router = inject(Router);
  private cookieService: CookieService = inject(CookieService);
  private baseApiUrl: string = environment.api;
  private authService: AuthService = inject(AuthService);
  public userData: UserDataResponse | null = null
  public fileName: string = ""
  public error: string = ""
  private image: any;
  private newImageUrl: string = ""

  public form: FormGroup = new FormGroup({
    url: new FormControl(""),
    description: new FormControl(),
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
      if (val.description.length > 200) {
        this.form.get("description")?.setValue(val.description.slice(0, 100))
      }
    })
    this.form.valueChanges.subscribe((val) => {
      if (val.l1name.length > 20) {
        this.form.get("l1name")?.setValue(val.l1name.slice(0, 20))
      }
    })
    this.form.valueChanges.subscribe((val) => {
      if (val.l2name.length > 20) {
        this.form.get("l2name")?.setValue(val.l2name.slice(0, 20))
      }
    })
    this.form.valueChanges.subscribe((val) => {
      if (val.l3name.length > 20) {
        this.form.get("l3name")?.setValue(val.l3name.slice(0, 20))
      }
    })
    //@ts-ignore
    this.newImageUrl = this.userData.Icon ?? ""
  }

  inputIcon(event: any) {
    this.error = "";
    const file: File = event.target.files[0]

    if (file) {
      this.fileName = ""
      if (file.size > 10 ** 6) {
        throwError("your file must be <1MB", (text: string) => this.error = text)
        this.file.nativeElement.value = ""
        this.form.get("url")?.setValue("")
        return
      } else if (
        !file.name.toLowerCase().includes(".jpg") &&
        !file.name.toLowerCase().includes(".jpeg") &&
        !file.name.toLowerCase().includes(".png")
      ) {
        throwError("jpeg/png", (text: string) => this.error = text)
        this.file.nativeElement.value = ""
        this.form.get("url")?.setValue("")
        return
      }
      this.fileName = file.name
      const reader = new FileReader()
      reader.onload = () => this.form.get("url")?.setValue(reader.result);
      reader.readAsDataURL(file);
      this.image = file
    }
  }

  async saveSettings() {
    if (this.image) {
      const formData = new FormData();
      formData.append("image", this.image);
      let res = await this.http.post<UserResponse>(this.baseApiUrl + "/createImage", formData, {
        headers: {
          "Authorization": this.userService.token
        }
      }).toPromise()
      if (!res) return
      this.newImageUrl = res.data.url
      if(this.userData?.Icon){
        let delRes = await this.http.delete<UserResponse>(this.baseApiUrl + "/deleteImage?url="+this.userData?.Icon, {
          headers:{
            "Authorization":this.cookieService.get("token")
          }
        }).toPromise()
      }

    }
    this.http.patch<UserResponse>(this.baseApiUrl + "/updateUser", {
      "User": this.userData?.User,
      "Icon": this.newImageUrl,
      "About": this.form.value.description,
      "Links": [
        {
          Name: this.form.value.l1name,
          Link: this.form.value.l1url,
        },
        {
          Name: this.form.value.l2name,
          Link: this.form.value.l2url,
        },
        {
          Name: this.form.value.l3name,
          Link: this.form.value.l3url,
        },
      ]
    }, {
      headers: {
        "Authorization": this.userService.token
      }
    }).subscribe(res => {
      this.router.navigateByUrl("/profile/" + this.userData?.User);
    })
  }

  protected readonly faSquareUpRight = faSquareUpRight;
  protected readonly faSquareCaretUp = faSquareCaretUp;
  protected readonly faUpload = faUpload;
  protected readonly environment = environment;
}
