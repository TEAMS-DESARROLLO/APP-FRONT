import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilsFechasService {
  constructor() {}

  convertToDate(dateString: string, separator:string): Date {
    let date = new Date();
    let day: number, month: number, year: number;
    switch (separator) {
      case '-':
        [day, month, year] = dateString.split('-').map(Number);
        date = new Date(year, month - 1, day);
        break;

      case '/':
        [day, month, year] = dateString.split('/').map(Number);
        date = new Date(year, month - 1, day);
        break;

    }

    return date;


  }
}
