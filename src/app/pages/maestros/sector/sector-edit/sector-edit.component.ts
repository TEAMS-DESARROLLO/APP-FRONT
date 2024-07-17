

import { Component, ElementRef, ViewChild, afterRender, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { ToolbarSaveQuitComponent } from "../../../shared/toolbar-save-quit/toolbar-save-quit.component";
import { distinctUntilChanged } from 'rxjs';
import { Router, ActivatedRoute, UrlTree } from '@angular/router';
import { CrudService } from '../../../../providers/crud.service';

import { OnExit } from '../../../../guards/exit.guard';
import { MessagesService } from '../../../shared/messages/messages.service';
import { SectorInterface } from '../sector-interface';

@Component({
  selector: 'app-sector-edit',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatCardModule, ToolbarSaveQuitComponent],
  templateUrl: './sector-edit.component.html',
  styleUrl: './sector-edit.component.css'
})
export default class SectorEditComponent {

  @ViewChild('myDescripcion') inputElement?: ElementRef;

  private crudService = inject(CrudService<SectorInterface>);
  private messagesService = inject(MessagesService);

  /** variables del componente */
  title = 'REGISTRO SECTOR';
  customForm!: FormGroup;
  _createRegister:boolean = false;



  constructor(private fb: FormBuilder,
    private router: Router,
    private activeRouter: ActivatedRoute,
    ){

  }
  onExit () {

    if(this.customForm.dirty ){

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


  ngOnInit() {
    this.customForm = this.fb.group({
      idSector: ['0', Validators.required],
      descripcion: ['', Validators.required],
      estado: ['A', Validators.required]

    });


    this.loadFromServer();

    setTimeout(() => {
      this.focusInput();
      this.upperCase();
    }, 500);


  }



  upperCase(){
      this.customForm.get('descripcion')?.valueChanges
        .pipe(
            distinctUntilChanged()
        ).subscribe(  (value:string) => {

              this.customForm.get('descripcion')?.patchValue( value!=null?value.toUpperCase():"")
        } );



  }


  focusInput() {
    this.inputElement?.nativeElement.focus();
  }

  loadFromServer():void{

    this.activeRouter.params.subscribe(
      params => {
        let id = params['id'];
        if(id == "0"){
          this._createRegister = true;
        }else{

          this._createRegister = false;
          this.crudService.readById("sector","",id)
          .subscribe(
            data => {
              Object.keys(data).forEach(name => {
                if (this.customForm.controls[name]) {
                  this.customForm.controls[name].patchValue(data[name]);
                }
              });
            });

        }
      });

  }

  save(){
    let data = this.customForm.value;

    this.crudService.create("sector","create",data)
      .subscribe(
        res=> {
          this.customForm.reset() ;
          this.router.navigate(['sector'], { relativeTo: this.activeRouter.parent });
          this.messagesService.message_ok('Grabado','Regirstro agregado')
        }
      );
  }

  update(){
    let data = this.customForm.value;

    let id = this.customForm.get('idSector')?.value;
    if(id){
      this.crudService.update('sector','', data,id )
        .subscribe({
          next: (resp) => {
            this.customForm.reset() ;
            this.messagesService.message_ok('Grabado','Regirstro actualizado');
            this.router.navigate(['sector'], { relativeTo: this.activeRouter.parent });
          },
          error : (error)=> {

          }
        })
    }
  }

  quit(e:any){

    setTimeout(() => {
      this.router.navigate(['sector'], { relativeTo: this.activeRouter.parent });

    }, 500);

  }


}
