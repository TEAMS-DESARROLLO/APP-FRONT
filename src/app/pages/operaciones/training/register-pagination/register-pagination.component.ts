import { Component, inject } from '@angular/core';
import { RegisterPaginationInterface } from '../register-pagination-interface';
import { ColDef, GridOptions, GridReadyEvent, IDatasource, IGetRowsParams, SelectionChangedEvent } from 'ag-grid-community';
import { CrudService } from '../../../../providers/crud.service';
import { MessagesService } from '../../../shared/messages/messages.service';
import { ConvertFilterSortAgGridToStandartService } from '../../../../utils/ConvertFilterSortAgGridToStandart.service';
import { PaginationService } from '../../../../providers/pagination.service';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { ToolbarToolboxComponent } from '../../../shared/toolbar-toolbox/toolbar-toolbox.component';
import { ActivatedRoute, Router } from '@angular/router';
import { CommunityInterface } from '../../../maestros/community/community-pagination/community.interface';
import { DatasourcePaginationInterface } from '../../../shared/interfaces/datasource-pagination-interface';
import { PaginationSortInterface } from '../../../../utils/interfaces/pagination.sort.interface';
import { NotificationsService } from '../../../shared/services/notifications.service';
import { ErrorInterface } from '../../../../utils/interfaces/errorInterface';
import { BtnFormacionComponent } from '../register/btn-formacion/btn-formacion.component';

@Component({
  selector: 'app-register-pagination',
  standalone: true,
  imports: [CommonModule, AgGridModule, ToolbarToolboxComponent],
  templateUrl: './register-pagination.component.html',
  styleUrl: './register-pagination.component.css',
})
export default class RegisterPaginationComponent {
  title = 'COLABORADORES EN DISPONIBILIDAD';

  themeClass = 'ag-theme-quartz-dark';

  gridParams: any;
  gridApi: any;
  gridColumnApi: any;
  currentPage: number = 0;
  dataSource: any;
  floatingFilter: boolean = false;
  countOnPagination: number = 0;

  rowData!: RegisterPaginationInterface[];

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
      width: 120,
    },
    {
      field: 'descriptionRegion',
      headerName: 'Region',
      filter: true,
      width: 155,
    },
    {
      field: 'descriptionCommunity',
      headerName: 'Comunidad',
      filter: true,
      width: 180,
    },
    {
      field: 'dateAdmission',
      headerName: 'Fecha Ingreso',
      filter: true,
      width: 150,
    },
    {
      field: 'namesCollaborator',
      headerName: 'Nombre Colaborador',
      filter: true,
      width: 200,
    },
    {
      field: 'lastnameCollaborator',
      headerName: 'Apellidos',
      filter: true,
      width: 200,
    },
    {
      headerName: 'Accion',
      field: 'tpriId',
      width: 130,
      cellRenderer: BtnFormacionComponent,
    },
  ];

  private notificacionesService = inject(NotificationsService);
  private paginationService = inject(PaginationService);
  private convertFilterSortAgGridToStandartService = inject(
    ConvertFilterSortAgGridToStandartService
  );
  private messagesService = inject(MessagesService);
  private crudService = inject(CrudService<RegisterPaginationInterface>);

  disabledEdit: boolean = false;
  disabledDelete: boolean = false;

  diabledSelect: boolean = false;

  dataPagination: any;

  context: any;

  constructor(private router: Router, private activeRouter: ActivatedRoute) {
    this.context = { componentParent: this };
  }

  onGridReady(params: GridReadyEvent<CommunityInterface>) {
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
            'registration',
            'pagination'
          )
          .subscribe({
            next: (data) => {
              this.dataPagination = data;
              const dataAux: DatasourcePaginationInterface = {
                content: data.content,
                totalElements: data.totalElements,
              };

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

                this.notificacionesService.showAlert(
                  'Paginacion Registro',
                  3000,
                  0
                );
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
    this.router.navigate(['training-register-edit', '0'], {
      relativeTo: this.activeRouter.parent,
    });
  }
  edit() {
    let rowData = this.gridApi.getSelectedRows();
    if (rowData.length == 0) {
      return;
    }
    let id = rowData[0].idRegister;
    this.router.navigate(['training-register-edit', id], {
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
          this.crudService.deleteById('community', '', id).subscribe({
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
  print() {}
  printExcel() {}
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
    //// this is a way to use private fields in typescript
    const api: any = this.gridApi;
    api.infinitePageRowModel.resetCache();
    this.gridApi.paginationPageSize = size;
  }

  onSelectionChanged($event: SelectionChangedEvent<any, any>) {
    if (this.gridApi.getSelectedRows().length > 0) {
      this.disabledEdit = true;
      this.disabledDelete = true;
      this.diabledSelect = true;
    } else {
      this.disabledEdit = false;
      this.disabledDelete = false;
      this.diabledSelect = false;
    }
  }

  onCellClicked($event: RegisterPaginationInterface) {


    this.router.navigate(['training-follow-up', $event.idRegister ], {
      relativeTo: this.activeRouter.parent,
    });

  }
}
