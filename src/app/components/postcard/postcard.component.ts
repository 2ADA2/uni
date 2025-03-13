import {Component, inject, Input} from '@angular/core';
import {round} from "../../utils/functions/round";
import {PostResponse} from "../../utils/models/responses";
import {RouterLink} from "@angular/router";
import {PostService} from "../../service/postService";
import {environment} from "../../../environments/environment";
import {NgStyle} from "@angular/common";

@Component({
  selector: 'app-postcard',
  standalone: true,
  imports: [
    RouterLink,
    NgStyle
  ],
  templateUrl: './postcard.component.html',
  styleUrl: './postcard.component.scss'
})

export class PostcardComponent {
  @Input() post: PostResponse | null = null;
  private postService: PostService = inject(PostService)

  public img = "https://media.tenor.com/ZePHeDDgsPIAAAAM/suspicious-cat.gif"
  public author = "ada"
  public icon = environment.icon;
  public header = "It's the first post on this site!"
  public text = "It's the first post on this site and i hope you like it. I think only you can understand how it's hard to develop such project. "

  likes: number | string = 139456
  bookmarks: number | string = 63464
  views: number | string = 12958478
  viewed: boolean = false

  ngOnInit() {
    if (this.post?.author) {
      this.likes = this.post.Likes;
      this.views = this.post?.Views;
      this.bookmarks = this.post?.Bookmarks;
      this.author = this.post?.author;
      this.text = this.post.text;
      this.header = this.post.Header;
      this.img = this.post.imgUrl;
      this.icon = this.post.Icon || environment.icon;
    }
    this.likes = round(Number(this.likes))
    this.bookmarks = round(Number(this.bookmarks))
    this.views = round(Number(this.views))
  }

  ngAfterViewInit() {
    const interval = setInterval(() => {
      if (this.post) {
        const postElement: HTMLElement | null = document.getElementById(this.post.ID);
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

  view() {
    let counts: number = 0
    const interval = setInterval(() => {
      if (this.post) {
        this.postService.view(this.post.ID)
          .subscribe()
        this.viewed = true
        clearInterval(interval)
      }
      counts += 1
      if (counts >= 5) clearInterval(interval)
    }, 100)
  }

}
