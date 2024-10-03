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
import { ErrorInterface } from '../../../utils/interfaces/errorInterface';
import { PaginationSortInterface } from '../../../utils/interfaces/pagination.sort.interface';
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
@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [CommonModule,AgGridModule,ToolbarToolboxComponent,MatFormFieldModule,MatIconModule,ReactiveFormsModule,MatInputModule,MatCardModule,ToolbarSaveQuitComponent,DropDownSharedMultipleComponent,MatFormFieldModule, MatInputModule, MatDatepickerModule, MatButtonModule],
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
  _flagCreateRegister = signal<boolean>(false);
  _registrationStatus = signal<string>("");
  
  minDate = new Date();
  
  arrayRole: DataSoureDropDownComboInterface[] = [];


  rowData !: RolInterface[];

  colDefs: ColDef[] = [
    /*{
      headerName: "Seleccionar", 
      checkboxSelection: true,
      headerCheckboxSelection: true,
      field: "isSelected"
    },*/
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

    paginationPageSizeSelector: [10, 20, 100],
    rowSelection: 'multiple',
    getRowId: params => params.data.id

  };

  loadingCellRendererParams = { loadingMessage: 'One moment please...' };
  loadingOverlayComponentParams = { loadingMessage: 'One moment please...' };

  disabledEdit: boolean = false;
  disabledDelete: boolean = false;
  disabledChange: boolean = false;
  dataPagination: any;

  constructor(private fb: FormBuilder,
    private router: Router,
    private activeRouter: ActivatedRoute) { }


  ngOnInit(): void {
    
    this.commonsService.data$.subscribe(
      res => {
        this.dataRole = res;
      }
    )

    this.commonsService.loadRoleForCombo();

    this.loadFromServer();
    
    setTimeout(() => {
      this.focusInput();
      this.upperCase();
    }, 500);


  }

  onSelectionChanged($event: SelectionChangedEvent<any, any>) {
    if (this.gridApi.getSelectedRows().length > 0) {
      this.disabledEdit = true;
      this.disabledDelete = false;
      this.disabledChange = true;
    } else {
      this.disabledEdit = false;
      this.disabledDelete = false;
      this.disabledChange = false;
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


  setDataSource(data: DatasourcePaginationInterface) {

    const dataSource: IDatasource = {

      "rowCount": data.totalElements,
      "getRows": (params: IGetRowsParams) => {  

        let _filterPage = this.gridApi.getFilterModel();
        let _agSort: [] = this.gridApi.sortController.getSortModel();
       let _sortForBack: PaginationSortInterface[] = this.convertFilterSortAgGridToStandartService.ConvertSortToStandar(_agSort);
        let _filtroForBack: any = this.convertFilterSortAgGridToStandartService.ConvertFilterToStandar(_filterPage);
 
        if (this.gridApi.paginationGetCurrentPage()) {
          this.currentPage = this.gridApi.paginationGetCurrentPage();
        }

        let countPage = this.gridApi.paginationGetPageSize();

        this.gridApi.showLoadingOverlay();
        this.paginationService.getPaginationAgGrid(this.currentPage, countPage, _filtroForBack, _sortForBack, "role", "pagination")
          .subscribe(
             
          {
            next : (data) => {
     
               setTimeout(() => {
                const rowsThisPage = data.content.map((dato: any) => ({
                  ...dato,
                  registrationStatus: dato.registrationStatus === 'A' ? 'Activo' : 'Inactivo'
                }));
                 
                
                 let lastRow = -1;
                 if (data.content.length <= params.endRow) {
                   lastRow = data.totalElements;
                 }

                 params.successCallback(rowsThisPage, lastRow);
                 let flg=0;
                 console.log(this._createRegister)
                 if(!this._createRegister)  {
                  rowsThisPage.forEach((row:any) => {
                    const roles = this.customerForm.get('roles')?.value;
                    if (roles && roles.includes(row.id)) {
                      const node = this.gridApi.getRowNode(row.id.toString()); 
                      if (node) {
                        node.setSelected(true); // Seleccionar la fila
                      }
                    }
                  });
                 }
                 
                 this.gridApi.hideOverlay();

     
               }, 100);
                           
            },
            error: (error:ErrorInterface)=>{

              //this.notificacionesService.showError(error);
              this.gridApi.hideOverlay();

            }            
          }

        )

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
  });

  addRol(){
    this.arrayRole = [];
    let data = this.customerForm.value;
    let roles = data.roles;
    this.arrayRole = this.dataRole.filter(role => roles.includes(role.value));
    console.log('this.arrayRole :', this.arrayRole);
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
                  console.log("name", data[name]);
                  if (name === "expirationDate") {
                  control.patchValue(this.convertStringToDate(data[name]));
                  } else {
                  control.patchValue(data[name]);
                  }
                }
              });
            })

        }
      });

  }

  convertStringToDate(dateString: string): Date {
    const [day, month, year] = dateString.split('-').map(part => parseInt(part, 10));
    return new Date(year, month - 1, day);
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
    let data = this.customerForm.value;

    let dataUser: UserInterface = {
      roles: data.roles,
      nombres: data.nombres,
      username: data.username,
      registrationStatus: this._registrationStatus(),
      password: data.password,
      expirationDate: this.formatDate(data.expirationDate),
    };
    

    console.log("data" , dataUser);
    this.crudService.create("user","create",dataUser)
      .subscribe(
        res=> {
          this.customerForm.reset() ;
          this.router.navigate(['users'], { relativeTo: this.activeRouter.parent });
          this.messagesService.message_ok('Grabado','Registro agregado')
        }
      );
  }

  formatDate = (date: string): string => {
    console.log(">>>>>>> ",date);
    const dateObj = new Date(date);
    console.log(">>>>>>> ",dateObj);
    const day = String(dateObj.getDate()).padStart(2, '0');
    console.log(">>>>>>> ",day);
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    console.log(">>>>>>> ",month);
    const year = dateObj.getFullYear();
    console.log(">>>>>>> ",year);
    console.log(">>>>>>> ",`${day}-${month}-${year}`);
    return `${day}-${month}-${year}`;
  };


  update(){
    let data = this.customerForm.value;
    
    let dataUser: UserInterface = {
      roles: data.roles,
      nombres: data.nombres,
      username: data.username,
      registrationStatus: this._registrationStatus(),
      expirationDate: this.formatDate(data.expirationDate),
    };
    
    console.log("data despues " , data)
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
  }

  get idRoleForm (){
    return this.customerForm.get('roles') as FormControl;
  }

}
