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
import { FunctionalLeaderInterface } from '../functional-leader-pagination/functional-leader.interface';
import { OnExit } from '../../../../guards/exit.guard';
import { MessagesService } from '../../../shared/messages/messages.service';



@Component({
    selector: 'app-community-edit',
    standalone: true,
    templateUrl: './functional-leader-edit.component.html',
    styleUrl: './functional-leader-edit.component.css',
    imports: [CommonModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatCardModule, ToolbarSaveQuitComponent]
})



export default class FunctionalLeaderEditComponent implements OnExit {

  @ViewChild('myDescripcion') inputElement?: ElementRef;

  private crudService = inject(CrudService<FunctionalLeaderInterface>);
  private messagesService = inject(MessagesService);

  /** variables del componente */
  title = 'LIDER FUNCIONAL';
  customerForm!: FormGroup;
  _createRegister:boolean = false;



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
      idFunctionalLeader: ['0', Validators.required],
      names: ['', Validators.required],

    });


    this.loadFromServer();

    setTimeout(() => {
      this.focusInput();
      this.upperCase();
    }, 500);


  }



  upperCase(){
      this.customerForm.get('names')?.valueChanges
        .pipe(
            distinctUntilChanged()
        ).subscribe(  (value:string) => {

              this.customerForm.get('names')?.patchValue( value!=null?value.toUpperCase():"")
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
          this.crudService.readById("functionalLeader","",id)
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

    this.crudService.create("functionalLeader","create",data)
      .subscribe(
        res=> {
          this.customerForm.reset() ;
          this.router.navigate(['functionalLeader'], { relativeTo: this.activeRouter.parent });
          this.messagesService.message_ok('Grabado','Regirstro agregado')
        }
      );
  }

  update(){
    let data = this.customerForm.value;

    let id = this.customerForm.get('idFunctionalLeader')?.value;
    if(id){
      this.crudService.update('community','', data,id )
        .subscribe({
          next: (resp) => {
            this.customerForm.reset() ;
            this.messagesService.message_ok('Grabado','Regirstro actualizado');
            this.router.navigate(['functionalLeader'], { relativeTo: this.activeRouter.parent });
          },
          error : (error)=> {

          }
        })
    }
  }

  quit(e:any){

    setTimeout(() => {
      this.router.navigate(['functionalLeader'], { relativeTo: this.activeRouter.parent });

    }, 500);

  }






}
