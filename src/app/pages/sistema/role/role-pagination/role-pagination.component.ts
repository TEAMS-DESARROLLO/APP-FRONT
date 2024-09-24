import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { CrudService } from '../../../../providers/crud.service';

import { AgGridModule } from 'ag-grid-angular';
import { ColDef, GridOptions, GridReadyEvent, IDatasource, IGetRowsParams, SelectionChangedEvent } from 'ag-grid-community';


import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

import { PaginationService } from '../../../../providers/pagination.service';
import { ConvertFilterSortAgGridToStandartService } from '../../../../utils/ConvertFilterSortAgGridToStandart.service';
import { PaginationSortInterface } from '../../../../utils/interfaces/pagination.sort.interface';
import { MessagesService } from '../../../shared/messages/messages.service';
import { ToolbarToolboxComponent } from '../../../shared/toolbar-toolbox/toolbar-toolbox.component';



import { ErrorInterface } from '../../../../utils/interfaces/errorInterface';
import { DatasourcePaginationInterface } from '../../../shared/interfaces/datasource-pagination-interface';
import { NotificationsService } from '../../../shared/services/notifications.service';
import { UserInterface } from '../../user-pagination/user.interface';


@Component({
  selector: 'app-role-pagination',
  standalone: true,
  imports: [CommonModule, AgGridModule, ToolbarToolboxComponent],
  templateUrl: './role-pagination.component.html',
  styleUrl: './role-pagination.component.css'
})
export default class RolePaginationComponent {

  title = 'ROL';

  
  themeClass = "ag-theme-quartz-dark";

  gridParams: any;
  gridApi: any;
  gridColumnApi: any;
  currentPage: number = 0;
  dataSource: any;
  floatingFilter: boolean = false;
  countOnPagination: number = 0;


  rowData !: UserInterface[];

  loadingCellRendererParams = { loadingMessage: 'One moment please...' };
  loadingOverlayComponentParams = { loadingMessage: 'One moment please...' };

  gridOptions: GridOptions = {

    pagination: true,
    rowModelType: 'infinite',
    maxBlocksInCache: 1,
    cacheBlockSize: 10,
    paginationPageSize: 10,
    suppressHorizontalScroll: false,

    paginationPageSizeSelector: [10, 20, 100],


  };

  colDefs: ColDef[] = [
    { field: "id", headerName :"Id", checkboxSelection: true, filter:true, },
    { field: "name", headerName: "Codigo", filter:true },
    { field: "description", headerName: "Descripcion", filter:true, flex:1 },

  ];



  private paginationService = inject(PaginationService);
  private convertFilterSortAgGridToStandartService = inject(ConvertFilterSortAgGridToStandartService);
  private messagesService = inject(MessagesService);
  private crudService = inject(CrudService<UserInterface>);


  disabledEdit: boolean = false;
  disabledDelete: boolean = false;

  dataPagination: any;

  private notificacionesService = inject(NotificationsService);

  constructor(private router: Router, private activeRouter: ActivatedRoute) {

  }

  onGridReady(params: GridReadyEvent<UserInterface>) {

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
    
                 const rowsThisPage = data.content;

                 let lastRow = -1;
                 if (data.content.length <= params.endRow) {
                   lastRow = data.totalElements;
                 }

                 params.successCallback(rowsThisPage, lastRow);
                 this.gridApi.hideOverlay();

     
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


  NewRegistter() {
    this.router.navigate(['role-edit', '0'], { relativeTo: this.activeRouter.parent });
  }

  edit() {
    
    let rowData = this.gridApi.getSelectedRows();
    if (rowData.length == 0) {
      return;
    }
    let id = rowData[0].id;
    this.router.navigate(['role-edit', id], { relativeTo: this.activeRouter.parent });
  }

  delete() {
    let rowData = this.gridApi.getSelectedRows();
    if (rowData.length == 0) {
      return;
    }
    let id = rowData[0].id;

    this.messagesService.message_question("warning", "Cuidado!", "Estas seguros de eliminar el registro " + id, "Si, Estoy seguro", "No, cancelar")
      .then(
        res => {
          if (res) {

            this.crudService.deleteById("role", "", id)
              .subscribe(
                {
                  next: (res) => {
                    this.messagesService.message_ok('procesado', 'Registro Eliminado')
                    this.reload();
                  },
                  error: (error) => {
                    this.messagesService.message_error('Atencion', error.message);
                  }
                }
              );
          }

        }
      )
      ;

  }


  reload() {

    this.gridOptions.cacheBlockSize = 10;
    this.gridApi.infiniteRowModel.resetCache();
    this.gridApi.paginationPageSize = 10;
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


  printExcel() {
     return null;
  }


  onSelectionChanged($event: SelectionChangedEvent<any, any>) {
    if (this.gridApi.getSelectedRows().length > 0) {
      this.disabledEdit = true;
      this.disabledDelete = true;
    } else {
      this.disabledEdit = false;
      this.disabledDelete = false;
    }
  }

}