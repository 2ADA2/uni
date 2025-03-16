export interface UserResponse {
  status: number;
  message: string;
  data: any;
}

export interface PostResponse {
  "ID": string;
  "author": string;
  "Header" : string
  "Icon" : string;
  "subs": number;
  "date": string;
  "text": string;
  "imgUrl": string;
  "Likes": number;
  "Bookmarks": number;
  "Views": number;
  "Reposts": number
  "Comments": number;
}
export interface UserDataResponse {
  User: string;
  About: string;
  Icon:string;
  Followers: string[];
  Subscribes: string[];
  Links: Link[];
  Date: string;
  Posts: any;
  Likes: string[];
  Reposts: string[];
  Bookmarks: string[];
  CommentLikes: string[];
  CommentDislikes: string[];
}
export interface UserShortDataResponse {
  User: string;
  About: string;
  Icon: string;
  Followers: string[];
  Subscribes: string[];
  Links: Link[];
  Date: string;
}

interface Link{
  Name:string;
  Link:string;
}

export interface Comment{
  Id : string;
  Author: string;
  Icon: string;
  Text: string;
  IsAnswer:boolean;
  Likes:number;
  Dislikes:number;
  Answers:Comment[]
}

export interface Comments{
  Comments:Comment[];
}
