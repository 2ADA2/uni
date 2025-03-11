import {Component, Input} from '@angular/core';
import {UserDataResponse, UserShortDataResponse} from "../../utils/models/responses";
import {round} from "../../utils/functions/round";
import {RouterLink} from "@angular/router";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-author-card',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './author-card.component.html',
  styleUrl: './author-card.component.scss'
})
export class AuthorCardComponent {
  @Input() userData!:UserShortDataResponse;
  public subscribers:string = "0"
  public icon = environment.icon || this.userData?.Icon

  ngOnInit() {
    this.subscribers = round(this.userData.Followers.length)
  }
}
