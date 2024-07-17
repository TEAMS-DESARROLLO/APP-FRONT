import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { LoginInterface } from './login.interface';
import { Observable, catchError, map, throwError } from 'rxjs';
import { LoginResponseInterface } from './login.response.interface';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'

})
export class LoginService {



  constructor(private http:HttpClient) { }

  getTokenWithLogin(login:LoginInterface):Observable<LoginResponseInterface>{

    let url = environment.protocol+environment.host+environment.port+'/'+environment.context+"auth/login";

    return this.http.post<LoginResponseInterface>(url,  login  )
      .pipe(

        catchError( error => {


              if( error.status === 403 ){
                console.log("Error 403 : " ,error );
                const response:LoginResponseInterface = {
                  status:403,
                  msg : "Las credenciales no son correctas!!",
                  token: ""
                }
                return throwError( () => response);
              }

              if( error.status === 0){
                const response:LoginResponseInterface = {
                      status:0,
                      msg : "No se logro conectar con el servidor!!!!!",
                      token: ""
                    };
                return throwError( () => response);

              }

              return throwError( () => error);
            }

         )
      );

  }



}
