import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, ActivatedRoute } from '@angular/router';
import { distinctUntilChanged } from 'rxjs';
import { CrudService } from '../../../../providers/crud.service';
import { MessagesService } from '../../../shared/messages/messages.service';
import { ToolbarSaveQuitComponent } from '../../../shared/toolbar-save-quit/toolbar-save-quit.component';
import { PaqueteInterface } from '../../paquete/paquete-interface';

@Component({
  selector: 'app-almcen-edit',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatCardModule, ToolbarSaveQuitComponent],
  templateUrl: './almcen-edit.component.html',
  styleUrl: './almcen-edit.component.css'
})
export default class AlmcenEditComponent {

  @ViewChild('myDescripcion') inputElement?: ElementRef;

  private crudService = inject(CrudService<PaqueteInterface>);
  private messagesService = inject(MessagesService);

  /** variables del componente */
  title = 'REGISTRO ALMACEN';
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
      idAlmacen: ['0', Validators.required],
      dscAlmacen: ['', Validators.required],
      ubicacion: ['', Validators.required],
      estado: ['A', Validators.required],

    });


    this.loadFromServer();

    setTimeout(() => {
      this.focusInput();
      this.upperCase();
    }, 500);


  }



  upperCase(){
      this.customForm.get('dscAlmacen')?.valueChanges
        .pipe(
            distinctUntilChanged()
        ).subscribe(  (value:string) => {

              this.customForm.get('dscAlmacen')?.patchValue( value!=null?value.toUpperCase():"")
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
          this.crudService.readById("almacen","",id)
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

    this.crudService.create("almacen","create",data)
      .subscribe(
        res=> {
          this.customForm.reset() ;
          this.router.navigate(['almacen'], { relativeTo: this.activeRouter.parent });
          this.messagesService.message_ok('Grabado','Regirstro agregado')
        }
      );
  }

  update(){
    let data = this.customForm.value;

    let id = this.customForm.get('idAlmacen')?.value;
    if(id){
      this.crudService.update('almacen','', data,id )
        .subscribe({
          next: (resp) => {
            this.customForm.reset() ;
            this.messagesService.message_ok('Grabado','Regirstro actualizado');
            this.router.navigate(['almacen'], { relativeTo: this.activeRouter.parent });
          },
          error : (error)=> {

          }
        })
    }
  }

  quit(e:any){

    setTimeout(() => {
      this.router.navigate(['almacen'], { relativeTo: this.activeRouter.parent });

    }, 500);

  }

}
