import { Component } from '@angular/core';
import {AuthorCardComponent} from "../../../components/author-card/author-card.component";

@Component({
  selector: 'app-follows',
  standalone: true,
  imports: [
    AuthorCardComponent
  ],
  templateUrl: './follows.component.html',
  styleUrl: './follows.component.scss'
})
export class FollowsComponent {

}
