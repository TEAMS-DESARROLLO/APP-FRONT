import { HttpInterceptorFn } from "@angular/common/http";


export const loggerInterceptor: HttpInterceptorFn = (req , next) => {


  let idToken = sessionStorage.getItem("auth_token");

  if (idToken) {
    const cloned = req.clone({
      headers: req.headers.set("Authorization",  idToken)
    });
    return next(cloned);
  }
  return next(req);
}
