export interface UserResponse {
  status: number;
  message: string;
  data: any;
}

export interface PostResponse {
  "ID": string;
  "author": string;
  "subs": number;
  "date": string;
  "text": string;
  "imgUrl": string;
  "Likes": number;
  "Bookmarks": number;
  "Views": number;
}
export interface UserDataResponse {
  User: string;
  About: string;
  Followers: string[];
  Subscribes: string[];
  Links: string[];
  Date: string;
  Posts: any;
  Likes: string[];
  Bookmarks: string[];
}

export interface PostCardInterface{
  author:string;
  views:number;
  likes:number;
  bookmarks:number;
  icon:string;
  src:string;
  header:string;
  text:string;
}

