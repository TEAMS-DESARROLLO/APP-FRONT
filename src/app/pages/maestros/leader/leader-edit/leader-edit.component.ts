import { Component, ElementRef, ViewChild, afterRender, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { ToolbarSaveQuitComponent } from "../../../shared/toolbar-save-quit/toolbar-save-quit.component";
import { distinctUntilChanged } from 'rxjs';
import { Router, ActivatedRoute, UrlTree } from '@angular/router';
import { CrudService } from '../../../../providers/crud.service';
import { LeaderInterface } from '../leader-pagination/leader.interface';
import { OnExit } from '../../../../guards/exit.guard';
import { MessagesService } from '../../../shared/messages/messages.service';
import { DropDownSharedComponent } from "../../../shared/drop-down-shared/drop-down-shared/drop-down-shared.component";
import { DataSoureDropDownComboInterface } from '../../../shared/interfaces/datasource-dropdown-interface';
import { CommonsService } from '../../../shared/services/commons.service';



@Component({
    selector: 'app-leader-edit',
    standalone: true,
    templateUrl: './leader-edit.component.html',
    styleUrl: './leader-edit.component.css',
    imports: [CommonModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatCardModule, ToolbarSaveQuitComponent, DropDownSharedComponent]
})



export default class LeaderEditComponent implements OnExit {

  @ViewChild('myDescripcion') inputElement?: ElementRef;

  private crudService = inject(CrudService<LeaderInterface>);
  private messagesService = inject(MessagesService);
  private commonsService = inject(CommonsService);

  /** variables del componente */
  title = 'LIDER';

  _createRegister:boolean = false;
  dataCommunity:DataSoureDropDownComboInterface[]=[];

  get f() { return this.customerForm.controls; }
  customerForm:FormGroup = this.fb.group({
    idLeader: ['0', Validators.required],
    idPractice: ['', Validators.required],
    names: ['', Validators.required],

  });



  get idCommunityForm (){
    return this.customerForm.get('idPractice') as FormControl;
  }

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
          this.crudService.readById("leader","",id)
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

    this.crudService.create("leader","create",data)
      .subscribe(
        res=> {
          this.customerForm.reset() ;
          this.router.navigate(['leader'], { relativeTo: this.activeRouter.parent });
          this.messagesService.message_ok('Grabado','Regirstro agregado')
        }
      );
  }

  update(){
    let data = this.customerForm.value;

    let id = this.customerForm.get('idLeader')?.value;
    if(id){
      this.crudService.update('leader','', data,id )
        .subscribe({
          next: (resp) => {
            this.customerForm.reset() ;
            this.messagesService.message_ok('Grabado','Regirstro actualizado');
            this.router.navigate(['leader'], { relativeTo: this.activeRouter.parent });
          },
          error : (error)=> {

          }
        })
    }
  }

  quit(e:any){

    setTimeout(() => {
      this.router.navigate(['leader'], { relativeTo: this.activeRouter.parent });

    }, 500);

  }






}
