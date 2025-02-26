export interface UserResponse {
  status: number;
  message: string;
  data: any;
}

export interface PostResponse {
  "ID": string;
  "author": string;
  "Header" : string
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
  Links: Link[];
  Date: string;
  Posts: any;
  Likes: string[];
  Bookmarks: string[];
}
export interface UserShortDataResponse {
  User: string;
  About: string;
  Followers: string[];
  Subscribes: string[];
  Links: Link[];
  Date: string;
}

interface Link{
  Name:string;
  Link:string;
}
