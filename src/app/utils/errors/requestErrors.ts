import {UserResponse} from "../models/responses";

export function requestError(err:UserResponse):string{
  if(err.message) {
    return err.message;
  }
  return "uknown error"
}
