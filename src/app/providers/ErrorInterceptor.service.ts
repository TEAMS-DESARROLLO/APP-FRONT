import { HttpInterceptorFn } from "@angular/common/http";



export const errorInterceptorService: HttpInterceptorFn = (req, next) => {
  debugger
  console.log("Request is on its way");
  return next(req);
};
