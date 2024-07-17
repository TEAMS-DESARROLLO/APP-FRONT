
import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators  } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { ToolbarSaveQuitComponent } from "../../shared/toolbar-save-quit/toolbar-save-quit.component";
import { distinctUntilChanged } from 'rxjs';
import { Router, ActivatedRoute, UrlTree } from '@angular/router';
import { CrudService } from '../../../providers/crud.service';
import { ClienteInterface } from '../cliente.interface';
import { OnExit } from '../../../guards/exit.guard';
import { MessagesService } from '../../shared/messages/messages.service';
import { DropDownSharedComponent } from "../../shared/drop-down-shared/drop-down-shared/drop-down-shared.component";
import { DataSoureDropDownComboInterface } from '../../shared/interfaces/datasource-dropdown-interface';
import { TipoDocumentoIdentidadInterface } from '../../maestros/tipo-documento-identidad/tipo-documento-identidad-pagination/tipo-documento-identidad.interface';
import { CommonsService } from '../../shared/services/commons.service';
import { CdkAccordionModule } from '@angular/cdk/accordion';



@Component({
    selector: 'app-cliente-edit',
    standalone: true,
    templateUrl: './cliente-edit.component.html',
    styleUrls: ['./cliente-edit.component.css'],
    imports: [CommonModule, CdkAccordionModule,
      MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatCardModule, ToolbarSaveQuitComponent, DropDownSharedComponent]
  })
  export default class  ViaEditComponent implements OnInit {


  @ViewChild('myDescripcion') inputElement?: ElementRef;

  private crudService = inject(CrudService<ClienteInterface>);
  private commonsService = inject(CommonsService)
  private messagesService = inject(MessagesService);

  /** varialbles del componente */
  title = 'REGISTRO CLIENTE';

  //customerForm!: FormGroup;

  _createRegister:boolean = false;
  dataTipoDocumentoIdentidad:DataSoureDropDownComboInterface[]=[];
  formulario: any;
  get f() { return this.customerForm.controls; }



  customerForm: FormGroup= this.fb.group({
    idCliente: ['0', Validators.required],
    codTipoDcumentoIdentidad: ['0', Validators.required],
    numeroDocumentoIdentidad: ['', Validators.required],
    nombres: ['', Validators.required],
    apellido1: ['', Validators.required],
    apellido2: ['', Validators.required],
    domicilioFiscal: ['', Validators.required],
    email: ['', Validators.required],
    cel1: ['', Validators.required],
    cel2: ['', Validators.required],
    estado: ['A', Validators.required]
  });

  get idTipoDocumentoIdendidadForm (){
    return this.customerForm.get('codTipoDcumentoIdentidad') as FormControl;
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
        ) ;
    }
    return true;
  }


  ngOnInit() {

    this.commonsService.data$.subscribe(
      res => {
        this.dataTipoDocumentoIdentidad = res;
      }
    )

    this.commonsService.loadTipoDocumentoIdentidadForCombo();



    this.loadFromServer();

    setTimeout(() => {
      this.focusInput();
      this.upperCase();
    }, 500);


  }



  upperCase(){
      this.customerForm.get('nombres')?.valueChanges
        .pipe(
            distinctUntilChanged()
        ).subscribe(  (value:string) => {

              this.customerForm.get('nombres')?.patchValue( value!=null?value.toUpperCase():"")
        } );

      this.customerForm.get('apellido1')?.valueChanges
        .pipe(
            distinctUntilChanged()
        ).subscribe(  (value:string) => {

            this.customerForm.get('apellido1')?.patchValue(value!=null?value.toUpperCase():"")
        } );

      this.customerForm.get('domicilioFiscal')?.valueChanges
        .pipe(
            distinctUntilChanged()
        ).subscribe(  (value:string) => {

            this.customerForm.get('domicilioFiscal')?.patchValue(value!=null?value.toUpperCase():"")
        } );

      this.customerForm.get('apellido2')?.valueChanges
        .pipe(
            distinctUntilChanged()
        ).subscribe(  (value:string) => {

            this.customerForm.get('apellido2')?.patchValue(value!=null?value.toUpperCase():"")
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
          this.crudService.readById("cliente","",id)
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

    this.crudService.create("cliente","create",data)
      .subscribe(
        res=> {
          this.customerForm.reset() ;
          this.router.navigate(['cliente'], { relativeTo: this.activeRouter.parent });
          this.messagesService.message_ok('Grabado','Regirstro agregado')
        }
      );
  }

  update(){

    let data = this.customerForm.value;

    let id = this.customerForm.get('idCliente')?.value;
    if(id){
      this.crudService.update('cliente','', data,id )
        .subscribe({
          next: (resp) => {
            this.customerForm.reset() ;
            this.messagesService.message_ok('Grabado','Regirstro actualizado');
            this.router.navigate(['cliente'], { relativeTo: this.activeRouter.parent });
          },
          error : (error)=> {

          }
        })
    }
  }



  quit(e:any){

    setTimeout(() => {
      this.router.navigate(['cliente'], { relativeTo: this.activeRouter.parent });

    }, 500);

  }


}
