export interface UserResponse {
  status: number;
  message: string;
  data: any;
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

