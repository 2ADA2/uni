import {Component, ElementRef, inject, Input, ViewChild} from '@angular/core';
import {NgClass, NgOptimizedImage, NgStyle} from "@angular/common";
import {RouterLink} from "@angular/router";
import {round} from "../../utils/functions/round";
import {Comment, Comments, PostResponse, UserDataResponse, UserResponse} from "../../utils/models/responses";
import {PostService} from "../../service/postService";
import {UserService} from "../../service/userService";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {
  faBucket,
  faComment,
  faEllipsisV,
  faRepeat,
  faThumbsDown,
  faThumbsUp, faTrash,
  faX
} from "@fortawesome/free-solid-svg-icons";
import {FormControl, FormGroup, FormsModule} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    FaIconComponent,
    NgClass,
    FormsModule,
    NgStyle
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent {
  @ViewChild("commentText") commentText!: ElementRef<HTMLTextAreaElement>;
  @ViewChild("answerText") answerText!: ElementRef<HTMLTextAreaElement>;
  private postService: PostService = inject(PostService);
  private userService: UserService = inject(UserService);
  private http: HttpClient = inject(HttpClient);
  private cookieService: CookieService = inject(CookieService);
  private baseApiUrl: string = environment.api;
  public imageUrl: string = environment.image;
  public standart = environment.icon
  public userData!: UserDataResponse


  public i: string = "data:image/jpeg;base64,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"


  @Input() postData: PostResponse = {
    "ID": "",
    "author": "",
    "Icon": "",
    "Header": "",
    "subs": 0,
    "date": "",
    "text": "",
    "imgUrl": "",
    "Likes": 0,
    "Bookmarks": 0,
    "Views": 0,
    "Reposts": 0,
    "Comments": 0,
  };

  public clickedLike: boolean = false;
  public clickedBookmarks: boolean = false;
  public liked: boolean = false
  public inBookmarks: boolean = false
  public reposted: boolean = false;
  public viewed: boolean = false

  public icon: string = environment.icon
  public ID: string = ""

  likesNum: number = 0
  bookmarksNum: number = 0
  viewsNum: number = 0
  repostsNum: number = 0

  likes: number | string = 0
  bookmarks: number | string = 0
  views: number | string = 0
  commentsNum: number | string = 0
  reposts: number | string = 0

  commentsView: boolean = false;
  comments: Comments = {
    "Comments": []
  }
  public allComments:Comment[] = []
  viewAnswers: string = ""

  public self: boolean = false;
  public optionsOpened: boolean = false;
  public deleteWindow: boolean = false;
  public code: string = String(Math.random()).slice(5, 9);
  public inputCode: string = ""

  public isAll: boolean = true
  public allText: string = ""

  comment: string = ""
  readyToComment: boolean = false
  answer: string = ""
  readyToAnswer: boolean = false
  readyToDeleteComment: boolean = false
  commentDelId: string | null = null
  commentParDelId: string | null = null

  ngOnInit() {
    const interval = setInterval(() => {
      if (this.postData.author) {
        this.likesNum = this.postData.Likes;
        this.bookmarksNum = this.postData.Bookmarks;
        this.viewsNum = this.postData.Views;
        this.repostsNum = this.postData.Reposts;

        this.likes = round(Number(this.likesNum))
        this.bookmarks = round(Number(this.bookmarksNum))
        this.views = round(Number(this.viewsNum))
        this.commentsNum = round(this.postData.Comments);
        this.reposts = round(this.postData.Reposts);

        if (this.userService.userData?.User) {
          this.userData = this.userService.userData
          if (!this.userData.CommentLikes) {
            this.userData.CommentLikes = []
          }
          if (!this.userData.CommentDislikes) {
            this.userData.CommentDislikes = []
          }
          const data: UserDataResponse = this.userService.userData
          const userLikes = data?.Likes
          if (userLikes?.includes(this.postData.ID)) this.liked = true;
          const userBookmarks = data?.Bookmarks
          if (userBookmarks?.includes(this.postData.ID)) this.inBookmarks = true
          const userReposts = data?.Reposts
          if (userReposts?.includes(this.postData.ID)) this.reposted = true
          this.ID = this.postData.ID
          this.self = (this.userService.userData.User === this.postData.author)
          this.icon = this.postData.Icon || environment.icon
          this.imageUrl = this.postData.imgUrl;
          this.allText = this.postData.text.substring(0, 400)
          if (this.allText.length < this.postData.text.length) this.isAll = false
          clearInterval(interval)
        }
      }
    }, 10)
  }

  ngAfterViewInit() {
    const interval = setInterval(() => {
      if (this.postData.ID) {
        const postElement: HTMLElement | null = document.getElementById(this.postData.ID);
        if (!postElement) return
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              if (!this.viewed) {
                this.view()
              }
            }
          });
        }, {
          threshold: 1.0
        });
        observer.observe(postElement)
        clearInterval(interval)
      }
    }, 10)
  }

  like() {
    this.postService.like(this.postData.ID)
      .subscribe(res => {
        this.userService.getSelfData().subscribe()
      })
    this.liked = !this.liked
    if (this.liked) {
      this.likesNum++
    } else {
      this.likesNum--
    }
    this.likes = round(this.likesNum)
    this.clickedLike = true;

  }

  repost() {
    this.postService.repost(this.postData.ID)
      .subscribe(res => {
        this.userService.getSelfData().subscribe()
      })
    this.reposted = !this.reposted
    if (this.reposted) {
      this.repostsNum++
    } else {
      this.repostsNum--
    }
    this.reposts = round(this.repostsNum)
  }

  addToBookmarks() {
    this.postService.addToBookmarks(this.postData.ID)
      .subscribe(res => {
        this.userService.getSelfData().subscribe()
      })
    this.inBookmarks = !this.inBookmarks
    if (this.inBookmarks) {
      this.bookmarksNum++
    } else {
      this.bookmarksNum--
    }
    this.bookmarks = round(this.bookmarksNum)
    this.clickedBookmarks = true;
  }

  view() {
    let counts: number = 0
    const interval = setInterval(() => {
      if (this.postData.ID) {
        this.postService.view(this.postData.ID)
          .subscribe()
        this.viewed = true
        clearInterval(interval)
      }
      counts += 1
      if (counts >= 5) clearInterval(interval)
    }, 100)
  }

  setCurrent() {
    this.postService.setCurrent(this.postData)
  }

  setOptions() {
    this.optionsOpened = !this.optionsOpened
  }

  setDelete() {
    this.deleteWindow = !this.deleteWindow
    if (this.deleteWindow) document.body.style.overflowY = "hidden";
    else document.body.style.overflowY = "scroll";
  }

  getAllText() {
    this.isAll = true
    this.allText = this.postData.text
  }

  async checkComments() {
    this.readyToComment = false;
    this.commentsView = !this.commentsView
    if (!this.comments.Comments.length) {
      const res = await this.http.get<UserResponse>(this.baseApiUrl + "/getComments?id=" + this.postData.ID, {
        headers: {
          "Authorization": this.cookieService.get("token")
        }
      }).toPromise()

      if (res) {
        this.allComments = res.data.comments || []
        this.comments = {"Comments": this.allComments.slice(0,5)}
        this.allComments = this.allComments.slice(5,this.allComments.length)
      }
    }
  }
  getMoreComments() {
    this.comments.Comments = [...this.comments.Comments, ...this.allComments.slice(0,5)]
    this.allComments = this.allComments.slice(5,this.allComments.length)
  }

  checkComment() {
    if (this.comment.length > 500) {
      this.comment = this.comment.slice(0, 500)
      this.commentText.nativeElement.value = this.comment
    }
  }

  leaveComment() {
    let check: string[] = this.comment.slice().split("")
    check = check.filter(str => str != "" && str != `\n`)
    if (check.length) {
      let date = new Date().toLocaleDateString("en-US");
      do {
        date = date.replace("/", ".")
      } while (date.includes("/"));

      const comment = {
        "PostId": this.postData.ID,
        "Text": this.comment,
        "Author": this.userService.userData?.User,
        "Icon": this.userService.userData?.Icon,
        "Date": date,
        "isAnswer": false,
      }

      this.http.post<UserResponse>(this.baseApiUrl + "/createComment", comment, {
        headers: {
          "Authorization": this.cookieService.get("token")
        }
      }).subscribe(res => {
        this.commentText.nativeElement.value = ""
        this.comment = ""
        this.comments = {"Comments": []}
        this.postData.Comments = this.postData.Comments + 1
        this.commentsNum = round(this.postData.Comments)
        this.commentsView = false
        this.checkComments()
      })
    }
  }

  leaveAnswer(id: string) {
    let check: string[] = this.answer.slice().split("")
    check = check.filter(str => str != "" && str != `\n`)
    if (check.length) {
      let date = new Date().toLocaleDateString("en-US");
      do {
        date = date.replace("/", ".")
      } while (date.includes("/"));

      this.http.post<UserResponse>(this.baseApiUrl + "/createComment", {
        "CommentId": id,
        "Text": this.answer,
        "Author": this.userService.userData?.User,
        "Icon": this.userService.userData?.Icon,
        "Date": date,
        "isAnswer": true,
      }, {
        headers: {
          "Authorization": this.cookieService.get("token")
        }
      }).subscribe(res => {
        this.answerText.nativeElement.value = ""
        this.answer = ""
        this.comments = {"Comments": []}
        this.postData.Comments = this.postData.Comments + 1
        this.commentsNum = round(this.postData.Comments)
        this.commentsView = false
        this.checkComments()
      })
    }
  }

  likeComment(id: string, pId?: string) {
    let comment!: Comment | undefined
    if (!pId) {
      comment = this.comments.Comments.find((e) => e.Id === id)
    } else {
      comment = this.comments.Comments.find((e) => e.Id === pId)
      if (!comment) return
      comment = comment.Answers.find(e => e.Id === id)
    }
    if (!comment) return
    let likes: number = comment.Likes
    let dislikes: number = comment.Dislikes

    this.http.post<UserResponse>(this.baseApiUrl + "/likeComment", {
      User: this.userService.userData?.User,
      AId: pId ? id : "",
      CId: pId ? pId : id,
    }, {
      headers: {
        "Authorization": this.cookieService.get("token")
      }
    }).subscribe(() => {
      if (this.userData.CommentLikes.includes(id)) {
        this.userData.CommentLikes.splice(this.userData.CommentLikes.indexOf(id), 1)
        likes -= 1
      } else if (this.userData.CommentDislikes.includes(id)) {
        this.userData.CommentDislikes.splice(this.userData.CommentLikes.indexOf(id), 1)
        this.userData.CommentLikes.push(id)
        dislikes -= 1
        likes += 1
        this.http.post<UserResponse>(this.baseApiUrl + "/dislikeComment", {
          User: this.userService.userData?.User,
          AId: pId ? id : "",
          CId: pId ? pId : id,
        }, {
          headers: {
            "Authorization": this.cookieService.get("token")
          }
        }).subscribe()
      } else {
        this.userData.CommentLikes.push(id)
        likes += 1
      }

      for (let i in this.comments.Comments) {
        if (this.comments.Comments[i].Id === pId) {
          for (let j in this.comments.Comments[i].Answers) {
            if (this.comments.Comments[i].Answers[j].Id === id) {
              this.comments.Comments[i].Answers[j].Likes = likes
              this.comments.Comments[i].Answers[j].Dislikes = dislikes
            }
          }
        } else if (this.comments.Comments[i].Id === id) {
          this.comments.Comments[i].Likes = likes
          this.comments.Comments[i].Dislikes = dislikes
        }
      }
    })
  }

  dislikeComment(id: string, pId?: string) {
    let comment!: Comment | undefined
    if (!pId) {
      comment = this.comments.Comments.find((e) => e.Id === id)
    } else {
      comment = this.comments.Comments.find((e) => e.Id === pId)
      if (!comment) return
      comment = comment.Answers.find(e => e.Id === id)
    }
    if (!comment) return
    let likes: number = comment.Likes
    let dislikes: number = comment.Dislikes

    this.http.post<UserResponse>(this.baseApiUrl + "/dislikeComment", {
      User: this.userService.userData?.User,
      AId: pId ? id : "",
      CId: pId ? pId : id,
    }, {
      headers: {
        "Authorization": this.cookieService.get("token")
      }
    }).subscribe(() => {
      if (this.userData.CommentDislikes.includes(id)) {
        this.userData.CommentDislikes.splice(this.userData.CommentDislikes.indexOf(id), 1)
        dislikes -= 1
      } else if (this.userData.CommentLikes.includes(id)) {
        this.userData.CommentLikes.splice(this.userData.CommentDislikes.indexOf(id), 1)
        this.userData.CommentDislikes.push(id)
        likes -= 1
        dislikes += 1
        this.http.post<UserResponse>(this.baseApiUrl + "/likeComment", {
          User: this.userService.userData?.User,
          AId: pId ? id : "",
          CId: pId ? pId : id,
        }, {
          headers: {
            "Authorization": this.cookieService.get("token")
          }
        }).subscribe()
      } else {
        this.userData.CommentDislikes.push(id)
        dislikes += 1
      }
      for (let i in this.comments.Comments) {
        if (this.comments.Comments[i].Id === pId) {
          for (let j in this.comments.Comments[i].Answers) {
            if (this.comments.Comments[i].Answers[j].Id === id) {
              this.comments.Comments[i].Answers[j].Likes = likes
              this.comments.Comments[i].Answers[j].Dislikes = dislikes
            }
          }
        } else if (this.comments.Comments[i].Id === id) {
          this.comments.Comments[i].Likes = likes
          this.comments.Comments[i].Dislikes = dislikes
        }
      }
    })
  }

  checkAnswers(id: string) {
    const answersContainer: Element = document.getElementsByClassName("answers")[0]
    if (answersContainer) {
      const newAnswers:Comment|undefined = this.comments.Comments.find((e) => e.Id === id)
      let newId: number | null = null
      if (newAnswers) {
        newId = this.comments.Comments.indexOf(newAnswers)
      }

      let oldId: number | null = null
      const oldAnswers:Comment|undefined = this.comments.Comments.find(e => e.Id == this.viewAnswers)
      if (oldAnswers) {
        oldId = this.comments.Comments.indexOf(oldAnswers)
      }
      if(newId && oldId){
        if(newId > oldId){
          window.scrollBy(0, -(answersContainer.getBoundingClientRect().height)+295)
        }
      }
    }
    this.readyToAnswer = false
    if (id === this.viewAnswers) {
      this.viewAnswers = ""
      return
    }
    this.viewAnswers = id
  }

  commentReady() {
    this.readyToComment = true
  }

  answerReady() {
    this.readyToAnswer = true
  }

  async delete() {
    if (this.inputCode === this.code) {
      if (this.postData.imgUrl) {
        let res = await this.http.delete(this.baseApiUrl + "/deleteImage?url=" + this.postData.imgUrl, {
          headers: {
            "Authorization": this.cookieService.get("token")
          }
        }).toPromise()
      }

      let res = this.http.delete(this.baseApiUrl + "/deletePost?id=" + this.postData.ID, {
        headers: {
          "Authorization": this.cookieService.get("token")
        }
      }).subscribe()

      this.optionsOpened = false
      window.location.reload()
    }
  }

  async deleteComment() {
    const pId = this.commentParDelId
    const id = this.commentDelId
    if (!this.commentDelId) {
      return
    }
    this.http.post<UserResponse>(this.baseApiUrl + "/deleteComment", {
      User: this.userService.userData?.User,
      AId: pId ? id : "",
      CId: pId ? pId : id,
    }, {
      headers: {
        "Authorization": this.cookieService.get("token")
      }
    }).subscribe(() => {
      this.commentsView = false
      this.comments = {"Comments": []}
      this.checkComments()
      this.commentsNum = round(this.comments.Comments.length)
      this.readyToDeleteComment = false
    })
  }

  async setDelComment(id?: string, pId?: string) {
    this.commentDelId = id || null
    this.commentParDelId = pId || null
    this.readyToDeleteComment = !this.readyToDeleteComment
  }

  protected readonly faEllipsisV = faEllipsisV;
  protected readonly faBucket = faBucket;
  protected readonly faX = faX;
  protected readonly faComment = faComment;
  protected readonly faRepeat = faRepeat;
  protected readonly length = length;
  protected readonly faThumbsUp = faThumbsUp;
  protected readonly faThumbsDown = faThumbsDown;
  protected readonly round = round;
  protected readonly faTrash = faTrash;
}
