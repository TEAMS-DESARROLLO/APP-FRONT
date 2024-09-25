import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { distinctUntilChanged } from 'rxjs';
import { CrudService } from '../../../../providers/crud.service';
import { MessagesService } from '../../../shared/messages/messages.service';
import { ToolbarSaveQuitComponent } from "../../../shared/toolbar-save-quit/toolbar-save-quit.component";
import { RolInterface } from '../role-pagination/rol.interface';


@Component({
  selector: 'app-rol-edit',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatCardModule, ToolbarSaveQuitComponent],
  templateUrl: './role-edit.component.html',
  styleUrl: './role-edit.component.css'
})
export default class RoleEditComponent {

  @ViewChild('myDescripcion') inputElement?: ElementRef;

  private crudService = inject(CrudService<RolInterface>);
  private messagesService = inject(MessagesService);

  /** variables del componente */
  title = 'ROL ';
  customerForm!: FormGroup;
  _createRegister:boolean = false;
  public _createdAt = signal(String);


  constructor(private fb: FormBuilder,
    private router: Router,
    private activeRouter: ActivatedRoute,
    ){
  }
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


  ngOnInit() {
    this.customerForm = this.fb.group({
      id: ['0', Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required],
    });


    this.loadFromServer();

    setTimeout(() => {
      this.focusInput();
      this.upperCase();
    }, 500);


  }



  upperCase(){
      this.customerForm.get('description')?.valueChanges
        .pipe(
            distinctUntilChanged()
        ).subscribe(  (value:string) => {

              this.customerForm.get('description')?.patchValue( value!=null?value.toUpperCase():"")
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
          this.crudService.readById("role","",id)
          .subscribe(
            data => {
              this._createdAt.set(data.createdAt);
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

    this.crudService.create("role","create",data)
      .subscribe(
        res=> {
          this.customerForm.reset() ;
          this.router.navigate(['role'], { relativeTo: this.activeRouter.parent });
          this.messagesService.message_ok('Grabado','Registro agregado')
        }
      );
  }

  update(){
    let data = this.customerForm.value;
    data.createdAt = this._createdAt();
    console.log("data " , data)
    let id = this.customerForm.get('id')?.value;
    if(id){
      this.crudService.update('role','', data,id )
        .subscribe({
          next: (resp) => {
            this.customerForm.reset() ;
            this.messagesService.message_ok('Grabado','Regirstro actualizado');
            this.router.navigate(['role'], { relativeTo: this.activeRouter.parent });
          },
          error : (error)=> {

          }
        })
    }
  }

  quit(e:any){

    setTimeout(() => {
      this.router.navigate(['role'], { relativeTo: this.activeRouter.parent });

    }, 500);

  }

}