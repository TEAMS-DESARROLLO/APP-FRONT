import { HttpInterceptorFn } from "@angular/common/http";



export const errorInterceptorService: HttpInterceptorFn = (req, next) => {

  return next(req);
};
