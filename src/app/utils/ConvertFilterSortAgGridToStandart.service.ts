import { Injectable } from '@angular/core';
import { PaginationFilterInterface } from './interfaces/pagination.filter.interface';

import { PrimeNGConfig } from 'primeng/api';

import { PaginationSortInterface } from './interfaces/pagination.sort.interface';


@Injectable({
  providedIn: 'root',
})
export class ConvertFilterSortAgGridToStandartService {
  constructor(private primengConfig: PrimeNGConfig) {}

  ConvertSortToStandar(sort: []) {
    let arraySort: PaginationSortInterface[] = [];

    sort.forEach((element) => {
      console.log(element);
      let sort: PaginationSortInterface = {
        colName: element['colId'],
        sort: element['sort'],
      };
      arraySort.push(sort);
    });
    return arraySort;
  }

  ConvertSortPrimeNgToStandar(sort: []) {
    let arraySort: PaginationSortInterface[] = [];

    sort.forEach((element) => {
      let sorter = 'asc';
      if (element['order'] == 1) {
        sorter = 'asc';
      } else if (element['order'] == -1) {
        sorter = 'desc';
      }

      let sort: PaginationSortInterface = {
        colName: element['field'],
        sort: sorter,
      };
      arraySort.push(sort);
    });
    return arraySort;
  }

  ConvertFilterPrimeNgToStandar(e:any){
    if (e == undefined || e == null) {
      return [];
    }
    let filters = e.filters;
    let _filtroForBack: any = [];
    for (let key in filters) {
      if (filters.hasOwnProperty(key)) {
        let filter = filters[key];
        if (filter[0].value != null && filter[0].value != undefined) {
          _filtroForBack.push({
            field: key,
            value: filter[0].value,
            matchMode: filter[0].matchMode,
          });
        }
      }
    }
    if (_filtroForBack.length == 0) {
      return [];
    }
    return _filtroForBack;

  }

  ConvertFilterToStandar(filtro: Object[]) {
    let arrayObjectChild: PaginationFilterInterface[] = [];
    let arrayFiltros = [];
    let arrayFiltroBack = [];

    for (var key in filtro) {
      if (filtro.hasOwnProperty(key)) {
        arrayFiltros.push({ key: key, val: filtro[key] });
      }
    }

    for (let index = 0; index < arrayFiltros.length; index++) {
      const objeto = arrayFiltros[index];

      const datos: { [key: string]: any } = objeto.val;

      let _filter: string = datos['filter'];
      let _typeComparation: string = datos['type'];
      //let _filterType:{[key:string]: any} = datos["filterType"];
      let _field = objeto.key.toString();

      let filtro: PaginationFilterInterface = {
        field: _field,
        value: _filter,
        typeComparation: _typeComparation,
      };

      arrayFiltroBack.push(filtro);
    }

    return arrayFiltroBack;
  }

  setSpanishLanguagePrimeNg() {
    this.primengConfig.setTranslation({
      accept: 'Aceptar',
      reject: 'Cancelar',
      choose: 'Seleccionar',
      upload: 'Subir',
      cancel: 'Cancelar',
      // Traducción de textos de p-table
      emptyMessage: 'No se encontraron registros', // Texto cuando no hay registros
      emptyFilterMessage: 'No se encontraron resultados', // Texto cuando no hay resultados en el filtro
      // Traducción de los operadores de filtro
      startsWith: 'Empieza con',
      contains: 'Contiene',
      notContains: 'No contiene',
      endsWith: 'Termina con',
      equals: 'Igual a',
      notEquals: 'No es igual a',
      lt: 'Menor que',
      lte: 'Menor o igual que',
      gt: 'Mayor que',
      gte: 'Mayor o igual que',
      is: 'Es',
      isNot: 'No es',
      before: 'Antes de',
      after: 'Después de',
      dateIs: 'Fecha es',
      dateIsNot: 'Fecha no es',
      dateBefore: 'Fecha es antes de',
      dateAfter: 'Fecha es después de',
      clear: 'Limpiar',
      apply: 'Aplicar',
      matchAll: 'Coincidir con todos',
      matchAny: 'Coincidir con cualquiera',
      addRule: 'Agregar regla',
      removeRule: 'Eliminar regla',
    });
  }
}
