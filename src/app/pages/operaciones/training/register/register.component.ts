import { Component, ElementRef, importProvidersFrom, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { CrudService } from '../../../../providers/crud.service';
import { TipoViaInterface } from '../../../maestros/tipo-via/tipo-via-pagination/tipo-via.interface';
import { MessagesService } from '../../../shared/messages/messages.service';
import { CommonsService } from '../../../shared/services/commons.service';
import { distinctUntilChanged } from 'rxjs';



import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';


import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DropDownSharedComponent } from '../../../shared/drop-down-shared/drop-down-shared/drop-down-shared.component';
import { ToolbarSaveQuitComponent } from '../../../shared/toolbar-save-quit/toolbar-save-quit.component';

import { CollaboratorInterface } from '../../../maestros/collaborator/collaborator-pagination/collaborator.interface';

import {MatDatepickerModule} from '@angular/material/datepicker';
import {ChangeDetectionStrategy} from '@angular/core';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule} from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter,  } from '@angular/material-moment-adapter';

import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import {default as _rollupMoment} from 'moment';

const moment = _rollupMoment || _moment;

const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-register',
  standalone: true,
  providers: [
   MatNativeDateModule,


    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},

    {provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS},    
        
  ],
  imports: [InputTextModule, IconFieldModule, InputIconModule, 
      MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatCardModule, ToolbarSaveQuitComponent, DropDownSharedComponent,
      MatIconModule,MatDividerModule, MatButtonModule, MatDatepickerModule, MatNativeDateModule
    ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export default class RegisterComponent {

  title ="Registro de colaborador disponible"
  _createRegister:boolean = false;

  @ViewChild('myDescripcion') inputElement?: ElementRef;

  private crudService = inject(CrudService<TipoViaInterface>);
  private messagesService = inject(MessagesService);
  private commonsService = inject(CommonsService);

  collaboratorInteface?:CollaboratorInterface;

  get f() { return this.customerForm.controls; }

  customerForm:FormGroup = this.fb.group({
    idCollaborator: ['', Validators.required],
    names: ['', Validators.required],
    lastName: ['', Validators.required],


  });  

  get idCommunityForm (){
    return this.customerForm.get('idCommunity') as FormControl;
  }   

  


  constructor(private fb: FormBuilder,
    private router: Router,
    private activeRouter: ActivatedRoute,
    ){}

    onExit () {

      if(this.customerForm.dirty ){
  
        return this.messagesService.message_question("question","Cuidado!","Estas seguros de salir sin grabar cambios","Si, Estoy seguro","No, cancelar")
          .then(
            res => {
              if(!res){
                setTimeout(() => {
                  this.focusInput();
                  this.upperCase();
                }, 500);
              }
              return res;
            }
          )
         ;
      }
      return true;
  
    }    

    findCollaborator(){
      
      debugger;
      const   idCollaborator =  this.customerForm.controls['idCollaborator'].value; //   580643;
      if(idCollaborator == '' || idCollaborator== undefined){
        this.customerForm.reset();
        return;
      }

      this.crudService.readById("collaborator","",idCollaborator)
        .subscribe({
          next : (data) => {


            Object.keys(data).forEach(name => {
              if (this.customerForm.controls[name]) {
                this.customerForm.controls[name].patchValue(data[name]);
              }
            });            

          }
        })
    }

    focusInput() {
      this.inputElement?.nativeElement.focus();
    }    

    upperCase(){
      this.customerForm.get('names')?.valueChanges
        .pipe(
            distinctUntilChanged()
        ).subscribe(  (value:string) => {

              this.customerForm.get('names')?.patchValue( value!=null?value.toUpperCase():"")
        } );

      this.customerForm.get('lastName')?.valueChanges
        .pipe(
            distinctUntilChanged()
        ).subscribe(  (value:string) => {

            this.customerForm.get('lastName')?.patchValue(value!=null?value.toUpperCase():"")
        } );

  }    

  loadFromServer():void{

    this.activeRouter.params.subscribe(
      params => {
        let id = params['id'];
        if(id == "0"){
          this._createRegister = true;
        }else{

          this._createRegister = false;
          this.crudService.readById("collaborator","",id)
          .subscribe(
            data => {
              Object.keys(data).forEach(name => {
                if (this.customerForm.controls[name]) {
                  this.customerForm.controls[name].patchValue(data[name]);
                }
              });
            });

        }
      });

  }

  save(){
    let data = this.customerForm.value;

    this.crudService.create("collaborator","create",data)
      .subscribe(
        res=> {
          this.customerForm.reset() ;
          this.router.navigate(['collaborator'], { relativeTo: this.activeRouter.parent });
          this.messagesService.message_ok('Grabado','Regirstro agregado')
        }
      );
  }

  update(){
    let data = this.customerForm.value;

    let id = this.customerForm.get('idCollaborator')?.value;
    if(id){
      this.crudService.update('collaborator','', data,id )
        .subscribe({
          next: (resp) => {
            this.customerForm.reset() ;
            this.messagesService.message_ok('Grabado','Regirstro actualizado');
            this.router.navigate(['collaborator'], { relativeTo: this.activeRouter.parent });
          },
          error : (error)=> {

          }
        })
    }
  }

  quit(e:any){

    setTimeout(() => {
      this.router.navigate(['collaborator'], { relativeTo: this.activeRouter.parent });

    }, 500);

  }  

}
