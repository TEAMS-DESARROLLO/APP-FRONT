import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef, GridOptions, GridReadyEvent, IDatasource, IGetRowsParams, SelectionChangedEvent } from 'ag-grid-community';
import { distinctUntilChanged } from 'rxjs';
import { OnExit } from '../../../guards/exit.guard';
import { CrudService } from '../../../providers/crud.service';
import { PaginationService } from '../../../providers/pagination.service';
import { ConvertFilterSortAgGridToStandartService } from '../../../utils/ConvertFilterSortAgGridToStandart.service';
import { DropDownSharedMultipleComponent } from "../../shared/drop-down-shared/drop-down-shared-multiple/drop-down-shared-multiple.component";
import { DataSoureDropDownComboInterface } from '../../shared/interfaces/datasource-dropdown-interface';
import { DatasourcePaginationInterface } from '../../shared/interfaces/datasource-pagination-interface';
import { MessagesService } from '../../shared/messages/messages.service';
import { CommonsService } from '../../shared/services/commons.service';
import { NotificationsService } from '../../shared/services/notifications.service';
import { ToolbarSaveQuitComponent } from '../../shared/toolbar-save-quit/toolbar-save-quit.component';
import { ToolbarToolboxComponent } from '../../shared/toolbar-toolbox/toolbar-toolbox.component';
import { RolInterface } from '../role/role-pagination/rol.interface';
import { UserInterface } from '../user-pagination/user.interface';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [CommonModule,AgGridModule,ToolbarToolboxComponent,MatFormFieldModule,MatIconModule,ReactiveFormsModule,MatInputModule,MatCardModule,ToolbarSaveQuitComponent,DropDownSharedMultipleComponent,MatFormFieldModule, MatInputModule, MatDatepickerModule, MatButtonModule,MatGridListModule,],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.css',
  providers: [provideNativeDateAdapter(),{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class UserEditComponent  implements OnExit {

  @ViewChild('myDescripcion') inputElement?: ElementRef;

  themeClass = "ag-theme-quartz-dark";

  private crudService = inject(CrudService<UserInterface>);
  private messagesService = inject(MessagesService);
  private commonsService = inject(CommonsService);
  
  private convertFilterSortAgGridToStandartService = inject(ConvertFilterSortAgGridToStandartService);
  private paginationService = inject(PaginationService);
  private notificacionesService = inject(NotificationsService);
  dataRole:DataSoureDropDownComboInterface[]=[];
  

  title = 'USUARIO';

  _createRegister:boolean = false;
  disabledDelete: boolean = false;
  disabledNew: boolean = true;


  _flagCreateRegister = signal<boolean>(false);
  _registrationStatus = signal<string>("");
  
  minDate = new Date();
  
  arrayRole: DataSoureDropDownComboInterface[] = [];


  rowData !: RolInterface[];

  colDefs: ColDef[] = [
    { field: "id", headerName :"Id", checkboxSelection: true, filter:true, },
    { field: "name", headerName: "Codigo", filter:true }
  ];
  
  gridParams: any;
  gridApi: any;
  currentPage: number = 0;

  gridOptions: GridOptions = {

    pagination: true,
    rowModelType: 'infinite',
    maxBlocksInCache: 1,
    cacheBlockSize: 10,
    paginationPageSize: 10,
    suppressHorizontalScroll: false,

    paginationPageSizeSelector: [10, 20, 100]
  };

  loadingCellRendererParams = { loadingMessage: 'One moment please...' };
  loadingOverlayComponentParams = { loadingMessage: 'One moment please...' };

  dataPagination: any;
  filename: string = '';
  base64Image: string | ArrayBuffer | null = null;

  messageErrorGrilla : string = "";
  constructor(private fb: FormBuilder,
    private router: Router,
    private activeRouter: ActivatedRoute) { }


  ngOnInit(): void {
    
    this.commonsService.data$.subscribe(
      res => {
        this.dataRole = res;
        this.loadgrillaRole();
      }
    )

    this.commonsService.loadRoleForCombo();

    this.loadFromServer();
    
    setTimeout(() => {
      this.focusInput();
      this.upperCase();
    }, 500);

   
  }


  loadgrillaRole(){
    console.log("loadgrillaRole... ");
      let data = this.customerForm.value;
      let arrayRolesLoad = data.roles;
      this.arrayRole = this.dataRole.filter(role => arrayRolesLoad.includes(role.value));
      const dataSourceAux: DatasourcePaginationInterface = { "content": [], "totalElements": 0 };
      this.setDataSource(dataSourceAux);
      console.log(this.arrayRole)
  }

  onSelectionChanged($event: SelectionChangedEvent<any, any>) {
    if (this.gridApi.getSelectedRows().length > 0) {
      this.disabledDelete = true;
    } else {
      this.disabledDelete = false;
    }
  }

  onPaginationChanged(e: any) {

    try {
      if (!this.gridApi.paginationGetCurrentPage()) {
        this.currentPage = 0;
      } else {
        this.currentPage = this.gridApi.paginationGetCurrentPage();
      }

    } catch (error) {
      this.currentPage = 0;
    }

  }

  onGridReady(params: GridReadyEvent<RolInterface>) {

    this.gridParams = params;
    this.gridApi = params.api;
    const dataSourceAux: DatasourcePaginationInterface = { "content": [], "totalElements": 0 };

    this.setDataSource(dataSourceAux);
    
  }

  addRol(){
    console.log("addRol... ");
    this.messageErrorGrilla ="";
    this.arrayRole = [];
    let data = this.customerForm.value;
    let roles = data.roles;
    this.arrayRole = this.dataRole.filter(role => roles.includes(role.value));
    const dataSource: DatasourcePaginationInterface = { "content": [], "totalElements": 0 };
    this.setDataSource(dataSource);
  }

  delete() {
    const selectedRows = this.gridApi.getSelectedRows();
    this.arrayRole = this.arrayRole.filter(role => !selectedRows.some((selected: { id: string; }) => selected.id === role.value));

    const dataSource: DatasourcePaginationInterface = { "content": [], "totalElements": 0 };
    this.setDataSource(dataSource);
    const control = this.customerForm.get("roles");
    control?.patchValue(this.arrayRole.map(role => role.value));
  }


  setDataSource(data: DatasourcePaginationInterface) {
    const dataSource: IDatasource = {

      "rowCount": this.arrayRole.length,
      "getRows": (params: IGetRowsParams) => {  
        
        if (this.gridApi.paginationGetCurrentPage()) {
          this.currentPage = this.gridApi.paginationGetCurrentPage();
        }

        this.gridApi.showLoadingOverlay();
       
          setTimeout(() => {
                const rowsThisPage = this.arrayRole.map(role => ({ id: role.value, name: role.viewValue }));
                 let lastRow = rowsThisPage.length;
                 params.successCallback(rowsThisPage, lastRow);
                 this.gridApi.hideOverlay();
          }, 100);
                           
          
      }}

     this.gridApi!.setGridOption('datasource', dataSource);

  }

  customerForm: FormGroup = this.fb.group({
    idUsuario: ['0', Validators.required],
    roles: ['', Validators.required],
    nombres: ['', Validators.required],
    username: ['', Validators.required],
    password: ['', this._flagCreateRegister() ? Validators.required : Validators.nullValidator ],
    expirationDate: ["", Validators.required],
    file: [''],
    filename:['']
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
          this._flagCreateRegister.set(true);
        }else{

          this._createRegister = false;
          this._flagCreateRegister.set(false);
          this.crudService.readById("user","",id)
          .subscribe(
            data => {
              this._registrationStatus.set(data.registrationStatus);
              Object.keys(data).forEach(name => {
                const control = this.customerForm.get(name);
                if (control) {
                  if (name === "expirationDate") {
                    this.customerForm.get('expirationDate')?.setValue(this.convertStringToDate(data[name].toString()));
                  } 
                  else if(name === "file"){
                    this.base64Image = data[name];
                  }
                  else {
                  control.patchValue(data[name]);
                  }
                  this.loadgrillaRole()
                }
              });
            })

        }
      });

  }

  convertStringToDate(dateString: string): any {
    if(dateString != null){
      const [day, month, year] = dateString.split('-').map(part => parseInt(part, 10));
      return new Date(year, month - 1, day);
    }
    return "";
  }

  quit(e:any){

    setTimeout(() => {
      this.router.navigate(['users'], { relativeTo: this.activeRouter.parent });

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
  
  save(){
    if(this.arrayRole.length>0){
      this.messageErrorGrilla ="";
      let data = this.customerForm.value;

      let dataUser: UserInterface = {
        roles: data.roles,
        nombres: data.nombres,
        username: data.username,
        registrationStatus: this._registrationStatus(),
        password: data.password,
        expirationDate: this.formatDate(data.expirationDate),
        file:data.file,
        filename:data.filename
      };
      
      this.crudService.create("user","create",dataUser)
        .subscribe(
          res=> {
            this.customerForm.reset() ;
            this.router.navigate(['users'], { relativeTo: this.activeRouter.parent });
            this.messagesService.message_ok('Grabado','Registro agregado')
          }
        );
    }else{
      this.messageErrorGrilla = "*No se ha cargado registros en la grilla";
    }
  }

  formatDate = (date: string): string => {
    const dateObj = new Date(date);
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    return `${day}-${month}-${year}`;
  };


  update(){
    if(this.arrayRole.length>0){
      
      this.messageErrorGrilla ="";
      let data = this.customerForm.value;
    
      let dataUser: UserInterface = {
        roles: data.roles,
        nombres: data.nombres,
        username: data.username,
        registrationStatus: this._registrationStatus(),
        expirationDate: this.formatDate(data.expirationDate),
        file:data.file,
        filename:data.filename
      };
    
      let id = this.customerForm.get('idUsuario')?.value;
      if(id){
        this.crudService.update('user/update','', dataUser,id )
          .subscribe({
            next: (resp) => {
              this.customerForm.reset() ;
              this.messagesService.message_ok('Grabado','Registro actualizado');
              this.router.navigate(['users'], { relativeTo: this.activeRouter.parent });
            },
            error : (error)=> {

            }
          })
      }

    }else{
      this.messageErrorGrilla = "*No se ha cargado registros en la grilla";
    }
  }

  get idRoleForm (){
    return this.customerForm.get('roles') as FormControl;
  }

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (result) {
          this.base64Image = result;
          this.customerForm.patchValue({ file: this.base64Image });
          this.customerForm.get('filename')?.setValue(file.name);
        }
      };
      reader.readAsDataURL(file); // Convertir archivo a base64
    }
  }



}
