import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';
import { Observable, catchError, throwError } from 'rxjs';
import { MessagesService } from '../pages/shared/messages/messages.service';

@Injectable({
  providedIn: 'root'
})
export class CrudService<T> {

  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })
  constructor(private http:HttpClient) { }

  create(controller:string,evento:string, model:any):Observable<T>   {
    let url = environment.protocol+environment.host+environment.port+'/'+environment.context+controller+"/"+evento;

    return this.http.post<T>(url, model, {headers:this.httpHeaders}).pipe(
      catchError( e=> {
        console.error(e.error.mensaje);
        return throwError( () => e.error);
      } )
    );
  }

  readById(controller:string,evento:string,id:any):Observable<T>  {
    const eventoFill = evento.length > 0 ? evento + "/" : "";
    let url = environment.protocol+environment.host +environment.port +'/'+ environment.context+controller + eventoFill;

    let endPoint = `${url}/${id}`

    return this.http.get<T>(endPoint).pipe(
      catchError( e=> {
        console.error(e.error.mensaje);
        return throwError( () => e.error);
      } )
    );

  }

  update(controller:string,evento:string,model:any,id:any):Observable<T>  {
    const eventoFill = evento.length > 0 ? evento + "/" : "";
    let url = environment.protocol+environment.host+environment.port+'/'+ environment.context+controller + eventoFill;
    let endPoint = `${url}/${id}`
    return this.http.put<T>(endPoint, model,  {headers:this.httpHeaders}).pipe(
      catchError( e=> {

        return throwError( () => e.error);
      } )
    );

  }

  deleteById(controller:string,evento:string,id:any){
    const eventoFill = evento.length > 0 ? evento + "/" : "";
    let url = environment.protocol+environment.host+environment.port+'/'+ environment.context+controller + eventoFill;
    let endPoint = `${url}/${id}`
    return this.http.delete<any>(endPoint).pipe(
      catchError( e=> {

        //console.log(e.mensaje);
        //this.messagesService.message_error('error','Atencion',)
        return throwError( () => e.error);
      } )
    ) ;
  }

  getAll(controller:string,evento:string,id:any):Observable<T[]> {


    let url = environment.protocol+environment.host+environment.port+'/'+ environment.context+controller +"/" +evento;
    let endPoint = `${url}`
    return this.http.get<T[]>(endPoint)
    .pipe(
      catchError( e=> {
        console.error(e.error.mensaje);
        return throwError( () => e.error);
      } )
    ); ;
  }

}
