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
import { CollaboratorInterface } from '../collaborator-pagination/collaborator.interface';
import { OnExit } from '../../../../guards/exit.guard';
import { MessagesService } from '../../../shared/messages/messages.service';
import { DataSoureDropDownComboInterface } from '../../../shared/interfaces/datasource-dropdown-interface';
import { CommonsService } from '../../../shared/services/commons.service';
import { DropDownSharedComponent } from "../../../shared/drop-down-shared/drop-down-shared/drop-down-shared.component";



@Component({
    selector: 'app-collaborador-edit',
    standalone: true,
    templateUrl: './collaborator-edit.component.html',
    styleUrl: './collaborator-edit.component.css',
    imports: [CommonModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatCardModule, ToolbarSaveQuitComponent, DropDownSharedComponent]
})



export default class CollaboratorEditComponent implements OnExit {

  @ViewChild('myDescripcion') inputElement?: ElementRef;

  private crudService = inject(CrudService<CollaboratorInterface>);
  private messagesService = inject(MessagesService);
  private commonsService = inject(CommonsService);

  /** variables del componente */
  title = 'COLABORADOR';
  
  _createRegister:boolean = false;

  dataCommunity:DataSoureDropDownComboInterface[]=[];
  dataLeader:DataSoureDropDownComboInterface[]=[];
  dataFunctionalLeader:DataSoureDropDownComboInterface[]=[];
  dataRol:DataSoureDropDownComboInterface[]=[];
  dataStatusCollaborator:DataSoureDropDownComboInterface[]=[];

  get f() { return this.customerForm.controls; }

  customerForm:FormGroup = this.fb.group({
    idCollaborator: ['0', Validators.required],
    names: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', Validators.required],
    idLeader: ['', Validators.required],
    leaderNames: ['', Validators.required],
    idRol: ['', Validators.required],
    rolDescription: ['', Validators.required],
    idRegion: ['', Validators.required],
    regionDescription: ['', Validators.required],
    idFunctionalLeader: ['', Validators.required],
    functionalLeaderNames: ['', Validators.required],
    idCommunity: ['', Validators.required],
    descripcion: ['', Validators.required],
    idStatusCollaborator: ['', Validators.required],

  });  

  get idCommunityForm (){
    return this.customerForm.get('idCommunity') as FormControl;
  }  
  get idLeaderForm (){
    return this.customerForm.get('idLeader') as FormControl;
  }  
  get idRolForm (){
    return this.customerForm.get('idRol') as FormControl;
  }  
  get idFunctionalLeaderForm (){
    return this.customerForm.get('idFunctionalLeader') as FormControl;
  }  
  get idStatusCollaboratorForm (){
    return this.customerForm.get('idStatusCollaborator') as FormControl;
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
        this.dataLeader = res;
      }
    )

    this.commonsService.commonsData$.subscribe(
      res => {
        if(res.group=="rol"){
          this.dataRol = res.dataArray;
        }
        if(res.group=="functionalLeader"){
          this.dataFunctionalLeader = res.dataArray;
        }
        if(res.group=="statusCollaborator"){
          this.dataStatusCollaborator = res.dataArray;
        }        
      }
    )

    this.commonsService.loadCommunityForCombo();
    this.commonsService.loadLeaderForCombo();
    this.commonsService.loadRolForComboWithLabel();
    this.commonsService.loadFunctionalLeaderForComboWithLabel();
    this.commonsService.loadStatusCollaboratorForComboWithLabel();

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

      this.customerForm.get('lastName')?.valueChanges
        .pipe(
            distinctUntilChanged()
        ).subscribe(  (value:string) => {

            this.customerForm.get('lastName')?.patchValue(value!=null?value.toUpperCase():"")
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
