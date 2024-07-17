import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/internal/operators/catchError';
import { environment } from '../../environments/environment';
import { PaginationSortInterface } from '../utils/interfaces/pagination.sort.interface';
import { ErrorInterface } from '../utils/interfaces/errorInterface';

@Injectable({
  providedIn: 'root'
})
export class PaginationService {

  constructor(private http:HttpClient) { }


  getPaginationAgGrid(pagenumber:number, rows:number, filters:any, sortModel:PaginationSortInterface[], controller:string, evento:string): Observable<any> {


    let pagination = {
      pageNumber : pagenumber,
      rowsPerPage: rows,
      filters: filters,
      sorts: sortModel
    }


    const params = new HttpParams()
    .set('pagination', JSON.stringify(pagination)  )

    let url = environment.protocol+environment.host+environment.port+'/'+environment.context+controller+"/"+evento;
    return this.http.post<any[]> (url, pagination).pipe(

      catchError( e => {
        return throwError( () =>  e.error);

      } )
    )

  }
}
