import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CrudService } from '../../../../providers/crud.service';
import { Router, ActivatedRoute } from '@angular/router';

import { AgGridModule } from 'ag-grid-angular';
import { ColDef, GridOptions, IGetRowsParams, SelectionChangedEvent, GridReadyEvent, IDatasource } from 'ag-grid-community'
import { DialogModule } from 'primeng/dialog';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

import { ToolbarToolboxComponent } from "../../../shared/toolbar-toolbox/toolbar-toolbox.component";
import { PaginationService } from '../../../../providers/pagination.service';
import { ConvertFilterSortAgGridToStandartService } from '../../../../utils/ConvertFilterSortAgGridToStandart.service';
import { PaginationSortInterface } from '../../../../utils/interfaces/pagination.sort.interface';
import { MessagesService } from '../../../shared/messages/messages.service';

import { CollaboratorInterface } from './collaborator.interface';

import { DatasourcePaginationInterface } from '../../../shared/interfaces/datasource-pagination-interface';
import { ErrorInterface } from '../../../../utils/interfaces/errorInterface';
import { NotificationsService } from '../../../shared/services/notifications.service';
import { ToolbarSelectCancelComponent } from "../../../shared/toolbar-select-cancel/toolbar-select-cancel.component";
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-collaborator',
  standalone: true,
  templateUrl: './collaborator.component.html',
  styleUrl: './collaborator.component.css',
  imports: [
    CommonModule,
    AgGridModule,
    ToolbarToolboxComponent,
    ToolbarSelectCancelComponent,
    DialogModule,
    MatFormFieldModule
  ],
})
export default class CollaboratorComponent {
  @Input()
  _seekingBehavior: boolean = false;

  @Output() _select: EventEmitter<any> = new EventEmitter();
  @Output() _quit: EventEmitter<any> = new EventEmitter();

  title = 'COLABORADOR';

  themeClass = 'ag-theme-quartz-dark';

  gridParams: any;
  gridApi: any;
  gridColumnApi: any;
  currentPage: number = 0;
  dataSource: any;
  floatingFilter: boolean = false;
  countOnPagination: number = 0;

  rowData!: CollaboratorInterface[];

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
    {
      field: 'idCollaborator',
      headerName: 'Codigo',
      checkboxSelection: true,
      filter: true,
      width: 130,
    },
    { field: 'names', headerName: 'Nombres', filter: true },
    { field: 'lastName', headerName: 'Apellidos', filter: true },
    { field: 'email', headerName: 'email', filter: true },
    { field: 'idLeader', headerName: 'Id Lider', filter: true, width: 100 },
    { field: 'leaderNames', headerName: 'Lider Nombres', filter: true },
    { field: 'idRol', headerName: 'id Rol', filter: true, width: 100 },
    { field: 'rolDescription', headerName: 'Rol', filter: true },
    { field: 'idRegion', headerName: 'id Region', filter: true, width: 100 },
    { field: 'regionDescription', headerName: 'Region', filter: true },
    {
      field: 'idFunctionalLeader',
      headerName: 'id Lider Funcional',
      filter: true,
      width: 100,
    },
    {
      field: 'functionalLeaderNames',
      headerName: 'Nombre Lider Funcional',
      filter: true,
      width: 400,
    },
  ];


  private paginationService = inject(PaginationService);
  private convertFilterSortAgGridToStandartService = inject(
    ConvertFilterSortAgGridToStandartService
  );
  private messagesService = inject(MessagesService);
  private crudService = inject(CrudService<CollaboratorInterface>);

  disabledEdit: boolean = false;
  disabledDelete: boolean = false;
  disabledSelect: boolean = false;
  visible: boolean = true;
  dataPagination: any;

  private notificacionesService = inject(NotificationsService);

  constructor(private router: Router, private activeRouter: ActivatedRoute) {}

  onGridReady(params: GridReadyEvent<CollaboratorInterface>) {
    this.gridParams = params;
    this.gridApi = params.api;
    const dataSourceAux: DatasourcePaginationInterface = {
      content: [],
      totalElements: 0,
    };

    this.setDataSource(dataSourceAux);
  }

  setDataSource(data: DatasourcePaginationInterface) {
    const dataSource: IDatasource = {
      rowCount: data.totalElements,
      getRows: (params: IGetRowsParams) => {
        let _filterPage = this.gridApi.getFilterModel();
        let _agSort: [] = this.gridApi.sortController.getSortModel();
        let _sortForBack: PaginationSortInterface[] =
          this.convertFilterSortAgGridToStandartService.ConvertSortToStandar(
            _agSort
          );
        let _filtroForBack: any =
          this.convertFilterSortAgGridToStandartService.ConvertFilterToStandar(
            _filterPage
          );

        if (this.gridApi.paginationGetCurrentPage()) {
          this.currentPage = this.gridApi.paginationGetCurrentPage();
        }

        let countPage = this.gridApi.paginationGetPageSize();

        this.gridApi.showLoadingOverlay();
        this.paginationService
          .getPaginationAgGrid(
            this.currentPage,
            countPage,
            _filtroForBack,
            _sortForBack,
            'collaborator',
            'pagination'
          )
          .subscribe({
            next: (data) => {
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
            error: (error: ErrorInterface) => {
              this.notificacionesService.showError(error);
              this.gridApi.hideOverlay();
            },
          });
      },
    };
    this.gridApi!.setGridOption('datasource', dataSource);
  }

  NewRegistter() {
    this.router.navigate(['collaborator-edit', '0'], {
      relativeTo: this.activeRouter.parent,
    });
  }
  edit() {
    let rowData = this.gridApi.getSelectedRows();
    if (rowData.length == 0) {
      return;
    }
    let id = rowData[0].idCollaborator;
    this.router.navigate(['collaborator-edit', id], {
      relativeTo: this.activeRouter.parent,
    });
  }
  delete() {
    let rowData = this.gridApi.getSelectedRows();
    if (rowData.length == 0) {
      return;
    }
    let id = rowData[0].idCollaborator;

    this.messagesService
      .message_question(
        'warning',
        'Cuidado!',
        'Estas seguros de eliminar el registro ' + id,
        'Si, Estoy seguro',
        'No, cancelar'
      )
      .then((res) => {
        if (res) {
          this.crudService.deleteById('collaborator', '', id).subscribe({
            next: (res) => {
              this.messagesService.message_ok(
                'procesado',
                'Registro Eliminado'
              );
              this.reload();
            },
            error: (error) => {
              this.messagesService.message_error('Atencion', error.message);
            },
          });
        }
      });
  }
  print() {
    return null;
  }
  printExcel() {
    return null;
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

  onGridPageSizeChanged(size: number): void {
    this.gridApi.cacheBlockSize = size;

    const api: any = this.gridApi;
    api.infinitePageRowModel.resetCache();
    this.gridApi.paginationPageSize = size;
  }

  onSelectionChanged($event: SelectionChangedEvent<any, any>) {
    if (this.gridApi.getSelectedRows().length > 0) {
      this.disabledEdit = true;
      this.disabledDelete = true;
      this.disabledSelect = true;
    } else {
      this.disabledEdit = false;
      this.disabledDelete = false;
      this.disabledSelect = false;
    }
  }

  selectFind() {
    let rowData = this.gridApi.getSelectedRows();
    if (rowData.length == 0) {
      return;
    }
    let id = rowData[0].idCollaborator;

    this._select.emit(id);
  }

  quitFind() {
    this._quit.emit();
  }
}
