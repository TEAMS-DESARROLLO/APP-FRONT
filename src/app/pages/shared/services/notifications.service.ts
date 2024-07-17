import { Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';
import { ErrorInterface } from '../../../utils/interfaces/errorInterface';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  private alertSource = new Subject();
  alert$ = this.alertSource.asObservable();
  constructor() { }

  showAlert(msg:string,time:number,httpStatus:number){
    this.alertSource.next({msg,time,httpStatus});
  }

  showError(error:ErrorInterface){

    const sError = error.error == undefined || error.error == null? "":error.error;
    const sMsg = error.message == undefined || error.message == null? "":error.message;

    let msg = sMsg+ " " + sError;
    let time = 6000;
    let status = error.httpStatusCode;
    this.alertSource.next({msg,time ,status});
  }
}
