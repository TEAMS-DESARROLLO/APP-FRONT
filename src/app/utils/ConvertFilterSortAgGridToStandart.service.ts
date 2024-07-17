import { Injectable, Type } from '@angular/core';
import { PaginationSortInterface } from './interfaces/pagination.sort.interface';
import { filter } from 'rxjs';
import { PaginationFilterInterface } from './interfaces/pagination.filter.interface';

@Injectable({
  providedIn: 'root'
})
export class ConvertFilterSortAgGridToStandartService {



  constructor() { }

  ConvertSortToStandar(sort:[]){
    let arraySort:PaginationSortInterface[] = [];

    sort.forEach(element => {
      console.log(element);
      let sort:PaginationSortInterface = {
        "colName": element['colId'],
        "sort": element['sort']
      }
      arraySort.push(sort);

    });
    return arraySort;

  }

  ConvertFilterToStandar(filtro:Object[]){

    let arrayObjectChild:PaginationFilterInterface[]=[]
    let arrayFiltros=[];
    let arrayFiltroBack=[];

    for (var key in filtro) {
      if (filtro.hasOwnProperty(key)) {
        arrayFiltros.push({key:key, val:filtro[key]}) ;
      }
    }

    for (let index = 0; index < arrayFiltros.length; index++) {
      const objeto = arrayFiltros[index];


      const datos:{[key:string]: any} = objeto.val;

      let _filter:string = datos["filter"];
      let _typeComparation:string= datos["type"];
      //let _filterType:{[key:string]: any} = datos["filterType"];
      let _field = objeto.key.toString();

      let filtro :PaginationFilterInterface ={
        "field" : _field,
        "value" : _filter,
        "typeComparation": _typeComparation,
      }

      arrayFiltroBack.push(filtro);

     }



    return arrayFiltroBack;

  }

}
