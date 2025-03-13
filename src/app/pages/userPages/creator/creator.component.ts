import {
  Component, ElementRef,
  inject, Input,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {UserService} from "../../../service/userService";
import {PostResponse, UserDataResponse, UserResponse} from "../../../utils/models/responses";
import {HttpClient} from "@angular/common/http";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {PostcardComponent} from "../../../components/postcard/postcard.component";
import {environment} from "../../../../environments/environment";
import {CookieService} from "ngx-cookie-service";
import {Router} from "@angular/router";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faUpload} from "@fortawesome/free-solid-svg-icons";
import {throwError} from "../../../utils/errors/requestErrors";

@Component({
  selector: 'app-creator',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    PostcardComponent,
    FaIconComponent
  ],
  templateUrl: './creator.component.html',
  styleUrl: './creator.component.scss'
})
export class CreatorComponent {
  @ViewChild("prototype", {static: true, read: ViewContainerRef}) prototype!: PostcardComponent;
  @ViewChild("file", {static: true}) file!: ElementRef<HTMLInputElement>;

  private userService: UserService = inject(UserService);
  private cookieService: CookieService = inject(CookieService);
  private http: HttpClient = inject(HttpClient);
  private baseApiUrl: string = environment.api;
  private router: Router = inject(Router);
  private image: any = null

  public date: string = ""
  public icon = environment.icon
  public postCard !: PostResponse;
  public fileName: string = ""

  protected form: FormGroup = new FormGroup({
    header: new FormControl(""),
    src: new FormControl(""),
    text: new FormControl(""),
  })

  public postData: PostResponse = {
    "ID": "123",
    "author": "ada",
    "Icon": "",
    "Header": "string",
    "subs": 12343,
    "date": "12.11.2000",
    "text": "text",
    "imgUrl": "https://media.tenor.com/ZePHeDDgsPIAAAAM/suspicious-cat.gif",
    "Likes": 123432,
    "Bookmarks": 22222,
    "Views": 4235322,
  }

  public error = ""

  ngOnInit() {
    this.userService.getSelfData().subscribe(res => {
      const userData: UserDataResponse = res.data.data
      this.postData.author = userData.User
      this.icon = userData.Icon || environment.icon;
      this.postData.Icon = userData.Icon
    })

    this.date = new Date().toLocaleDateString("en-US");
    do {
      this.date = this.date.replace("/", ".")
    } while (this.date.includes("/"));
    this.postData.date = this.date;

    this.form.valueChanges.subscribe((value) => {
      if (value.header.length > 60) {
        this.form.get("header")?.setValue(value.header.slice(0, 60))
      }
      if (value.text.length > 5000) {
        this.form.get("text")?.setValue(value.text.slice(0, 5000))
      }
      this.postData.Header = this.form.value.header;
      this.postData.imgUrl = this.form.value.src;
      this.postData.text = this.form.value.text;

      this.prototype.post = this.postData;
    })

    this.http.get<UserResponse>(this.baseApiUrl + "/getPosts", {
      headers: {
        "Authorization": this.cookieService.get("token")
      }
    }).subscribe(res => {
      this.postCard = res.data.data[0];
    })
  }

  onImageSelected(event: any) {
    this.error = "";
    const file: File = event.target.files[0]

    if (file) {
      this.fileName = ""
      if (file.size > 10 ** 7) {
        throwError("your file must be <10MB", (text: string) => this.error = text)
        this.file.nativeElement.value = ""
        this.form.get("src")?.setValue("")
        return
      } else if (
        !file.name.toLowerCase().includes(".jpg") &&
        !file.name.toLowerCase().includes(".jpeg") &&
        !file.name.toLowerCase().includes(".png") &&
        !file.name.toLowerCase().includes(".gif")
      ) {
        throwError("jpeg/png/gif", (text: string) => this.error = text)
        this.file.nativeElement.value = ""
        this.form.get("src")?.setValue("")
        return
      }
      this.fileName = file.name
      const reader = new FileReader()
      reader.onload = () => this.form.get("src")?.setValue(reader.result);
      reader.readAsDataURL(file);
      this.image = file
    }
  }

  async createPost() {
    this.error = ""
    if (this.form.value.header.length < 3) {
      //Your header is too short!
      throwError("Your header is too short!", (text: string) => this.error = text)
      return
    } else if (this.form.value.src === "" && this.form.value.text === "") {
      throwError("your post doesn't have text or image", (text: string) => this.error = text)
      return
    }
    const formData = new FormData()
    formData.append("image", this.image)
    let url :string = ""
    if(this.image){
      let src = await this.http.post<UserResponse>(this.baseApiUrl + "/createImage", formData, {
        headers: {
          "Authorization": this.cookieService.get("token"),
        }
      }).toPromise()
      if (!src) return
      url = src.data.url
    }

    this.http.post(this.baseApiUrl + "/createPost", {
      Author: this.postData.author,
      Date: this.postData.date,
      Icon: this.postData.Icon,
      Text: this.postData.text,
      //@ts-ignore
      ImgUrl:url,
      Header: this.postData.Header,
      Likes: 0,
      Bookmarks: 0,
      Views: 0,
    }, {
      headers: {
        "Authorization": this.cookieService.get("token")
      }
    }).subscribe(() => {
      this.router.navigate(["/"])
    })
  }

  protected readonly faUpload = faUpload;
}
