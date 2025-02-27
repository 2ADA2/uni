import {
  Component,
  inject,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {UserService} from "../../../service/userService";
import {PostResponse, UserDataResponse, UserResponse} from "../../../utils/models/responses";
import {HttpClient} from "@angular/common/http";
import {AuthService} from "../../../register/auth.service";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {PostcardComponent} from "../../../components/postcard/postcard.component";
import {environment} from "../../../../environments/environment";
import {CookieService} from "ngx-cookie-service";
import {Router} from "@angular/router";
import {PostService} from "../../../service/postService";

@Component({
  selector: 'app-creator',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    PostcardComponent
  ],
  templateUrl: './creator.component.html',
  styleUrl: './creator.component.scss'
})
export class CreatorComponent {
  @ViewChild("prototype", {static: true, read: ViewContainerRef}) prototype!: PostcardComponent;

  private userService: UserService = inject(UserService);
  private cookieService: CookieService = inject(CookieService);
  private http: HttpClient = inject(HttpClient);
  private baseApiUrl: string = environment.api;
  private router: Router = inject(Router);

  public date: string = ""
  public icon = "data:image/png;base64,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"
  public postCard !:PostResponse;

  protected form: FormGroup = new FormGroup({
    header: new FormControl(""),
    src: new FormControl(""),
    text: new FormControl(""),
  })

  public postData: PostResponse = {
    "ID": "123",
    "author": "ada",
    "Header" : "string",
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
      const userData:UserDataResponse = res.data.data
      this.postData.author = userData.User
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
      if (value.text.length > 200) {
        this.form.get("text")?.setValue(value.text.slice(0, 200))
      }
      this.postData.Header = this.form.value.header;
      this.postData.imgUrl = this.form.value.src;
      this.postData.text = this.form.value.text;

      this.prototype.post = this.postData;
    })

    this.http.get<UserResponse>(this.baseApiUrl+"/getPosts", {
      headers:{
        "Authorization":this.cookieService.get("token")
      }
    }).subscribe(res => {
      this.postCard = res.data.data[0];
    })
  }

  createPost() {
    this.error = ""
    if (this.form.value.header.length < 3) {
      setTimeout(() => {
        this.error = "Your header is too short!"
      })
      return
    } else if (this.form.value.src === "" && this.form.value.text === "") {
      setTimeout(() => {
        this.error = "your post doesn't have text or image"
      })
      return
    }


    this.http.post(this.baseApiUrl + "/createPost", {
      Author: this.postData.author,
      Date: this.postData.date,
      Text: this.postData.text,
      ImgUrl: this.postData.imgUrl,
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
}
