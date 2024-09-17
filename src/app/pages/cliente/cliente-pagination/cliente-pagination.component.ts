import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CrudService } from '../../../providers/crud.service';
import { Router, ActivatedRoute } from '@angular/router';

import { AgGridModule } from 'ag-grid-angular';
import { ColDef, GridOptions, IGetRowsParams, SelectionChangedEvent, GridReadyEvent, IDatasource } from 'ag-grid-community'


import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

import { ToolbarToolboxComponent } from "../../shared/toolbar-toolbox/toolbar-toolbox.component";
import { PaginationService } from '../../../providers/pagination.service';
import { ConvertFilterSortAgGridToStandartService } from '../../../utils/ConvertFilterSortAgGridToStandart.service';
import { PaginationSortInterface } from '../../../utils/interfaces/pagination.sort.interface';
import { ClienteInterface } from '../cliente.interface';
import { MessagesService } from '../../shared/messages/messages.service';
import { Observable } from 'rxjs/internal/Observable';
import { DatasourcePaginationInterface } from '../../shared/interfaces/datasource-pagination-interface';
import { NotificationsService } from '../../shared/services/notifications.service';
import { ErrorInterface } from '../../../utils/interfaces/errorInterface';

@Component({
    selector: 'app-tipo-via',
    standalone: true,
    templateUrl: './cliente-pagination.component.html',
    styleUrl: './cliente-pagination.component.css',
    imports: [CommonModule, AgGridModule, ToolbarToolboxComponent, ]
})
export default class  ClienteComponent {


  title = 'CLIENTES'

  themeClass =  "ag-theme-quartz-dark";

  gridParams:any;
  gridApi:any;
  gridColumnApi: any;
  currentPage:number = 0;
  dataSource:any;
  floatingFilter:boolean=false;
  countOnPagination:number=0;


  rowData!:ClienteInterface[] ;

  loadingCellRendererParams = { loadingMessage: 'One moment please...' };
  loadingOverlayComponentParams = {loadingMessage: 'One moment please...'};

  gridOptions: GridOptions = {

    pagination: true,
    rowModelType: 'infinite',
    maxBlocksInCache : 1,
    cacheBlockSize: 10,
    paginationPageSize: 10,
    suppressHorizontalScroll: false,

    paginationPageSizeSelector: [10, 20, 100],


  };

  colDefs: ColDef[] = [
    { field: "idCliente", headerName :"Codigo", checkboxSelection: true, filter:true, },
    { field: "nombres", headerName: "Nombres", filter:true },
    { field: "apellido1", headerName: "Apellido 1", filter:true },
    { field: "apellido2", headerName: "Apellido 2", filter:true },
    { field: "codTipoDcumentoIdentidad", headerName: "Cod.Doc.Ident", filter:true },
    { field: "nombreDocumentoIdentidad", headerName: "Descripcion Doc.", filter:true },
    { field: "numeroDocumentoIdentidad", headerName: "Numero Doc.", filter:true, flex:1 },

  ];


  private paginationService = inject(PaginationService);
  private convertFilterSortAgGridToStandartService = inject(ConvertFilterSortAgGridToStandartService);
  private messagesService = inject(MessagesService);
  private crudService = inject(CrudService<ClienteInterface>);


  disabledEdit: boolean=false;
  disabledDelete: boolean=false;

  dataPagination:any;

  private notificacionesService = inject(NotificationsService);

  constructor(private router:Router, private activeRouter:ActivatedRoute){

  }



  onGridReady(params: GridReadyEvent<ClienteInterface>) {

    this.gridParams = params;
    this.gridApi = params.api;
    const dataSourceAux:DatasourcePaginationInterface={"content":[],"totalElements":0};

    this.setDataSource(dataSourceAux);


  }



  setDataSource(data:DatasourcePaginationInterface){

    const dataSource : IDatasource = {

      "rowCount":data.totalElements,
      "getRows": (params:IGetRowsParams) => {

        let _filterPage = this.gridApi.getFilterModel();
        let _agSort:[] = this.gridApi.sortController.getSortModel();
        let _sortForBack:PaginationSortInterface[] = this.convertFilterSortAgGridToStandartService.ConvertSortToStandar(_agSort);
        let _filtroForBack:any = this.convertFilterSortAgGridToStandartService.ConvertFilterToStandar(_filterPage) ;

        if(this.gridApi.paginationGetCurrentPage()){
          this.currentPage = this.gridApi.paginationGetCurrentPage();
        }

        let countPage = this.gridApi.paginationGetPageSize();

        this.gridApi.showLoadingOverlay();
        this.paginationService.getPaginationAgGrid(this.currentPage, countPage, _filtroForBack, _sortForBack , "cliente", "pagination")
        .subscribe(
          {
            next: (data) => {
              this.dataPagination = data;
              const dataAux:DatasourcePaginationInterface = { "content": data.content, "totalElements":data.totalElements};

             setTimeout(() => {
               // take a slice of the total rows

               const rowsThisPage = data.content;
               // if on or after the last page, work out the last row.
               let lastRow = -1;
               if (data.content.length <= params.endRow) {
                 lastRow = data.totalElements;
               }
               // call the success callback
               params.successCallback(rowsThisPage, lastRow);
               this.gridApi.hideOverlay();
               //this.dataSource = dataSource;
               //this.notificacionesService.datosCompartidos.set("...... paginacion ... completa ...!!!!");

               this.notificacionesService.showAlert("Paginacion clientes",3000,0);


             }, 100);
            },
            error: (error:ErrorInterface)=>{

              this.notificacionesService.showError(error);
              this.gridApi.hideOverlay();

            }
          }


         )

      }}
      this.gridApi!.setGridOption('datasource', dataSource);

  }

  NewRegistter(){
    this.router.navigate(['cliente-edit', '0'], { relativeTo: this.activeRouter.parent });
  }
  edit(){

    let rowData = this.gridApi.getSelectedRows();
    if(rowData.length == 0){
      return;
    }
    let id = rowData[0].idCliente;
    this.router.navigate(['cliente-edit', id], { relativeTo: this.activeRouter.parent });
  }
  delete(){
    let rowData = this.gridApi.getSelectedRows();
    if(rowData.length == 0){
      return;
    }
    let id = rowData[0].idCliente;

    this.messagesService.message_question("warning","Cuidado!","Estas seguros de eliminar el registro " + id,"Si, Estoy seguro","No, cancelar")
    .then(
      res => {
        if(res){

          this.crudService.deleteById("cliente","",id)
            .subscribe(
              {
                next: (res) => {
                  this.messagesService.message_ok('procesado','Registro Eliminado')
                  this.reload();
                },
                error: (error) => {
                  this.messagesService.message_error('Atencion',error.message);
                }
              }
            );
        }

      }
    )
   ;

  }
  print(){

  }
  printExcel(){




  }
  reload(){

    this.gridOptions.cacheBlockSize = 10;
    this.gridApi.infiniteRowModel.resetCache();
    this.gridApi.paginationPageSize = 10;
  }

  onPaginationChanged(e:any) {



    try {
      if(!this.gridApi.paginationGetCurrentPage()){
        this.currentPage = 0;
      }else{
        this.currentPage = this.gridApi.paginationGetCurrentPage();
      }

    } catch (error) {
      this.currentPage = 0;
    }

  }

  onGridPageSizeChanged(size: number): void {
    this.gridApi.cacheBlockSize = size;
//// this is a way to use private fields in typescript
    const api: any = this.gridApi;
    api.infinitePageRowModel.resetCache();
    this.gridApi.paginationPageSize = size;

}

  onSelectionChanged($event: SelectionChangedEvent<any,any>) {
    if(this.gridApi.getSelectedRows().length > 0){
      this.disabledEdit = true;
      this.disabledDelete = true;
    }else{
      this.disabledEdit = false;
      this.disabledDelete = false;
    }
  }

}
