import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { OnExit } from '../../../guards/exit.guard';
import { ActivatedRoute, Router, UrlTree } from '@angular/router';
import { distinctUntilChanged, Observable } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DropDownSharedComponent } from '../../shared/drop-down-shared/drop-down-shared/drop-down-shared.component';
import { ToolbarSaveQuitComponent } from '../../shared/toolbar-save-quit/toolbar-save-quit.component';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MessagesService } from '../../shared/messages/messages.service';
import { CommonsService } from '../../shared/services/commons.service';
import { DataSoureDropDownComboInterface } from '../../shared/interfaces/datasource-dropdown-interface';
import { CrudService } from '../../../providers/crud.service';
import { LeaderInterface } from '../../maestros/leader/leader-pagination/leader.interface';
import { UserInterface } from '../user-pagination/user.interface';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatCardModule, ToolbarSaveQuitComponent, DropDownSharedComponent],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.css'
})
export default class UserEditComponent  implements OnExit {

  @ViewChild('myDescripcion') inputElement?: ElementRef;

  private crudService = inject(CrudService<UserInterface>);
  private messagesService = inject(MessagesService);
  private commonsService = inject(CommonsService);
  dataCommunity:DataSoureDropDownComboInterface[]=[];

  title = 'USUARIO';

  _createRegister:boolean = false;

  constructor(private fb: FormBuilder,
    private router: Router,
    private activeRouter: ActivatedRoute) { }


  ngOnInit(): void {
    
    this.commonsService.data$.subscribe(
      res => {
        this.dataCommunity = res;
      }
    )

    this.commonsService.loadCommunityForCombo();

    this.loadFromServer();

    setTimeout(() => {
      this.focusInput();
      this.upperCase();
    }, 500);


  }

  customerForm:FormGroup = this.fb.group({
    idUser: ['0', Validators.required],
    role: ['', Validators.required],
    names: ['', Validators.required],
    username: ['', Validators.required],

  });

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
          /*this.crudService.readById("user","",id)
          .subscribe(
            data => {
              Object.keys(data).forEach(name => {
                if (this.customerForm.controls[name]) {
                  this.customerForm.controls[name].patchValue("Geraldo Achuy"); //data[name]
                }
              });
            });*/
            
            if (this.customerForm.controls["names"]) {
              this.customerForm.controls["names"].patchValue("Geraldo Achuy"); //data[name]
            }

        }
      });

  }

  quit(e:any){

    setTimeout(() => {
      this.router.navigate(['user'], { relativeTo: this.activeRouter.parent });

    }, 500);

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
  
  
}
