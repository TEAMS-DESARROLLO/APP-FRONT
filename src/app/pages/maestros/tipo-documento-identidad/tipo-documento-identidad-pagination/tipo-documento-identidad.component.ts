import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Router, ActivatedRoute } from '@angular/router';


import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridOptions, IGetRowsParams, SelectionChangedEvent, GridReadyEvent, IDatasource } from 'ag-grid-community'

// import 'ag-grid-community/styles/ag-grid.css';
// import 'ag-grid-community/styles/ag-theme-quartz.css';

import { ToolbarToolboxComponent } from "../../../shared/toolbar-toolbox/toolbar-toolbox.component";
import { PaginationService } from '../../../../providers/pagination.service';
import { ConvertFilterSortAgGridToStandartService } from '../../../../utils/ConvertFilterSortAgGridToStandart.service';
import { PaginationSortInterface } from '../../../../utils/interfaces/pagination.sort.interface';
import { TipoDocumentoIdentidadInterface } from './tipo-documento-identidad.interface';

@Component({
    selector: 'app-tipo-documento-identidad',
    standalone: true,
    templateUrl: './tipo-documento-identidad.component.html',
    styleUrl: './tipo-documento-identidad.component.css',
    imports: [CommonModule,AgGridAngular, ToolbarToolboxComponent]
})
export default class TipoDocumentoIdentidadComponent {

  title = 'TIPO DE DOCUMENTO DE IDENTIDAD'

  themeClass =  "ag-theme-quartz-dark";

  gridApi:any;
  gridColumnApi: any;
  currentPage:number = 0;
  dataSource:any;
  floatingFilter:boolean=false;

  rowData!:TipoDocumentoIdentidadInterface[] ;

  loadingCellRendererParams = { loadingMessage: 'One moment please...' };
  loadingOverlayComponentParams = {loadingMessage: 'One moment please...'};

  gridOptions: GridOptions = {

    pagination: true,
    rowModelType: 'infinite',
    cacheBlockSize: 20,
    paginationPageSize: 20,
    suppressHorizontalScroll: false,


  };

  colDefs: ColDef[] = [
    { field: "codigo", headerName :"Codigo", checkboxSelection: true, filter:true, width:100},
    { field: "descripcion", headerName: "Descripcion", filter:true,width:400 },
    { field: "estado", headerName: "Estado", filter:true, flex:1 },

  ];


  private paginationService = inject(PaginationService);
  private convertFilterSortAgGridToStandartService = inject(ConvertFilterSortAgGridToStandartService);

  disabledEdit: boolean=false;
  disabledDelete: boolean=false;

  constructor(private router:Router, private activeRouter:ActivatedRoute){

  }

  onGridReady(params: GridReadyEvent<TipoDocumentoIdentidadInterface>) {

    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    let _filterPage = this.gridApi.getFilterModel();
    let _agSort:[] = this.gridApi.sortController.getSortModel();

    let _sortForBack:PaginationSortInterface[] = this.convertFilterSortAgGridToStandartService.ConvertSortToStandar(_agSort);
    let _filtroForBack:any = this.convertFilterSortAgGridToStandartService.ConvertFilterToStandar(_filterPage) ;

    if(this.gridApi.paginationGetCurrentPage()){
      this.currentPage = this.gridApi.paginationGetCurrentPage();
    }
    this.gridApi.showLoadingOverlay();
    this.paginationService.getPaginationAgGrid(this.currentPage, 20, _filtroForBack, _sortForBack , "tipodocumentoidentidad", "pagination")
    .subscribe( data =>{

       const iDataSource: IDatasource= {
        getRows: (params: IGetRowsParams) => {
          setTimeout(() => {
            params.successCallback(data['content'], data.totalElements);
            this.gridApi.hideOverlay();
          }, 100);
        },
      }
      this.dataSource = iDataSource;
      this.gridApi!.setGridOption('datasource', this.dataSource);
    })
  }



  newRegister(){

    this.router.navigate(['tipo-documento-identidad-edit', '0'], { relativeTo: this.activeRouter.parent });

  }
  edit(){

    let rowData = this.gridApi.getSelectedRows();
    if(rowData.length == 0){
      return;
    }
    let id = rowData[0].codigo;

    this.router.navigate(['tipo-documento-identidad-edit', id], { relativeTo: this.activeRouter.parent });

  }
  delete(){

  }
  print(){

  }
  excel(){

  }
  reload(){

    this.gridApi.setDatasource(this.dataSource);

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
