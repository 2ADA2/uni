import {UserResponse} from "../models/responses";

export function requestError(err:UserResponse):string{
  if(err.message) {
    return err.message;
  }
  return "uknown error"
}

export function throwError (text:string, throwErr = (text:string) => {}){
  setTimeout (() => {
    throwErr(text || "unknown error");
  },10)
}
