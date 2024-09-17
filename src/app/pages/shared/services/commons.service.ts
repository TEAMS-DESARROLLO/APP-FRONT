import { Injectable, inject } from '@angular/core';
import { CrudService } from '../../../providers/crud.service';
import { ViaInterface } from '../../maestros/via/via-pagination/via.interface';
import { DataSoureDropDownComboInterface } from '../interfaces/datasource-dropdown-interface';
import { MessagesService } from '../messages/messages.service';
import { Observable, Subject, asyncScheduler, from } from 'rxjs';
import { CommonsDataInteface } from './commons/service/commons.data.interface';

@Injectable({
  providedIn: 'root'
})
export class CommonsService {

  private crudService = inject(CrudService<any>);
  private messagesService = inject(MessagesService);

  data$ = new Subject<DataSoureDropDownComboInterface[]>();
  commonsData$ = new Subject<CommonsDataInteface>();


  constructor() { }

  loadStatusCollaboratorForComboWithLabel(){
    let dataArray:DataSoureDropDownComboInterface[]=[];
    this.crudService.getAll("statuscollaborator","all",null)
    .subscribe(
      {
        next:(res)=> {
          let data = res ;
          data.forEach( element => {

            const dato:DataSoureDropDownComboInterface = {
              "value" : element.idStatusCollaborator,
              "viewValue" : element.descriptionStatusCollaborator
            }

            dataArray.push(dato);

          } );

          //devolucion con grupo
          const info:CommonsDataInteface ={
            "group":"statusCollaborator",
            "dataArray": dataArray
          }
          this.commonsData$.next(info);

        }
        ,
        error:(error)=> {
          this.messagesService.message_error('Atencion',error.message);
          return [];
        }
      }
    );
    return [];

  }

  loadFunctionalLeaderForComboWithLabel(){
    let dataArray:DataSoureDropDownComboInterface[]=[];
    this.crudService.getAll("functionalLeader","all",null)
    .subscribe(
      {
        next:(res)=> {
          let data = res ;
          data.forEach( element => {

            const dato:DataSoureDropDownComboInterface = {
              "value" : element.idFunctionalLeader,
              "viewValue" : element.names
            }

            dataArray.push(dato);

          } );

          //devolucion con grupo
          const info:CommonsDataInteface ={
            "group":"functionalLeader",
            "dataArray": dataArray
          }
          this.commonsData$.next(info);

        }
        ,
        error:(error)=> {
          this.messagesService.message_error('Atencion',error.message);
          return [];
        }
      }
    );
    return [];

  }

  loadRolForComboWithLabel(){
    let dataArray:DataSoureDropDownComboInterface[]=[];
    this.crudService.getAll("rol","all",null)
    .subscribe(
      {
        next:(res)=> {
          let data = res ;
          data.forEach( element => {

            const dato:DataSoureDropDownComboInterface = {
              "value" : element.idRol,
              "viewValue" : element.description
            }

            dataArray.push(dato);

          } );

          //devolucion con grupo
          const info:CommonsDataInteface ={
            "group":"rol",
            "dataArray": dataArray
          }
          this.commonsData$.next(info);

        }
        ,
        error:(error)=> {
          this.messagesService.message_error('Atencion',error.message);
          return [];
        }
      }
    );
    return [];

  }

  loadLeaderForCombo(){
    let dataArray:DataSoureDropDownComboInterface[]=[];
    this.crudService.getAll("leader","all",null)
    .subscribe(
      {
        next:(res)=> {
          let data = res ;
          data.forEach( element => {
            const dato:DataSoureDropDownComboInterface = {
              "value" : element.idLeader,
              "viewValue" : element.names
            }

            dataArray.push(dato);

          } );
          this.data$.next(dataArray);

        }
        ,
        error:(error)=> {
          this.messagesService.message_error('Atencion',error.message);
          return [];
        }
      }
    );
    return [];

  }


  loadFunctionalLeaderForCombo(){
    let dataArray:DataSoureDropDownComboInterface[]=[];
    this.crudService.getAll("functionalLeader","all",null)
    .subscribe(
      {
        next:(res)=> {
          let data = res ;
          data.forEach( element => {
            const dato:DataSoureDropDownComboInterface = {
              "value" : element.idFunctionalLeader,
              "viewValue" : element.names
            }

            dataArray.push(dato);

          } );
          this.data$.next(dataArray);

        }
        ,
        error:(error)=> {
          this.messagesService.message_error('Atencion',error.message);
          return [];
        }
      }
    );
    return [];

  }


  loadCommunityForCombo(){
    let dataArray:DataSoureDropDownComboInterface[]=[];
    this.crudService.getAll("community","all",null)
    .subscribe(
      {
        next:(res)=> {
          let data = res ;
          data.forEach( element => {
            const dato:DataSoureDropDownComboInterface = {
              "value" : element.idPractice,
              "viewValue" : element.description
            }

            dataArray.push(dato);

          } );
          this.data$.next(dataArray);

        }
        ,
        error:(error)=> {
          this.messagesService.message_error('Atencion',error.message);
          return [];
        }
      }
    );
    return [];

  }


  loadTipoViaForCombo(){
    let dataTipoVia:DataSoureDropDownComboInterface[]=[];
    this.crudService.getAll("tipovia","all",null)
    .subscribe(
      {
        next:(res)=> {
          let data = res ;
          data.forEach( element => {
            const tipovia:DataSoureDropDownComboInterface = {
              "value" : element.idTipoVia,
              "viewValue" : element.descripcion
            }

            dataTipoVia.push(tipovia);

          } );
          this.data$.next(dataTipoVia);

        }
        ,
        error:(error)=> {
          this.messagesService.message_error('Atencion',error.message);
          return [];
        }
      }
    );
    return [];

  }

  loadTipoDocumentoIdentidadForCombo(){
    let dataTipoDocumentoIdentidad:DataSoureDropDownComboInterface[]=[];
    this.crudService.getAll("tipodocumentoidentidad","all",null)
    .subscribe(
      {
        next:(res)=> {
          let data = res ;
          data.forEach( element => {
            const tipoDocumentoIdentidad:DataSoureDropDownComboInterface = {
              "value" : element.codigo,
              "viewValue" : element.descripcion
            }

            dataTipoDocumentoIdentidad.push(tipoDocumentoIdentidad);

          } );
          this.data$.next(dataTipoDocumentoIdentidad);

        }
        ,
        error:(error)=> {
          this.messagesService.message_error('Atencion',error.message);
          return [];
        }
      }
    );
    return [];

  }
}
