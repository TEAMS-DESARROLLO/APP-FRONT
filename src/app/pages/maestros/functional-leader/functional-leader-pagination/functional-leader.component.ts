import { Component, HostListener, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CrudService } from '../../../../providers/crud.service';
import { Router, ActivatedRoute } from '@angular/router';

import { Table, TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { SortEvent } from 'primeng/api';

import { ToolbarToolboxComponent } from "../../../shared/toolbar-toolbox/toolbar-toolbox.component";
import { PaginationService } from '../../../../providers/pagination.service';
import { PaginationSortInterface } from '../../../../utils/interfaces/pagination.sort.interface';
import { MessagesService } from '../../../shared/messages/messages.service';

import { FunctionalLeaderInterface } from './functional-leader.interface';

import { NotificationsService } from '../../../shared/services/notifications.service';
import { ErrorInterface } from '../../../../utils/interfaces/errorInterface';
import { debounceTime } from 'rxjs';
import { ConvertFilterSortAgGridToStandartService } from '../../../../utils/ConvertFilterSortAgGridToStandart.service';


interface PageEvent {
  page?: number;
  first?: number;
  rows?: number;
  pageCount?: number;
}



@Component({
  selector: 'app-community',
  standalone: true,
  templateUrl: './functional-leader.component.html',
  styleUrl: './functional-leader.component.css',
  imports: [
    CommonModule,
    ToolbarToolboxComponent,
    TableModule,
    PaginatorModule,
  ],
})
export default class FunctionalLeaderComponent implements OnInit {
  title = 'LIDERES FUNCIONALES';

  private paginationService = inject(PaginationService);
  private messagesService = inject(MessagesService);
  private crudService = inject(CrudService<FunctionalLeaderInterface>);
  private convertFilterSortAgGridToStandartService = inject(
    ConvertFilterSortAgGridToStandartService
  );
  private notificacionesService = inject(NotificationsService);

  rowData: FunctionalLeaderInterface[] = [];
  currentPage: number = 0;
  dataSource: any;
  floatingFilter: boolean = false;
  countOnPagination: number = 0;

  isSorted: boolean = false;
  filtroForBack: any = [];
  sortForBack: any = [];
  metaKey: boolean = true;
  selectedLider!: FunctionalLeaderInterface;
  loading: boolean = false;
  scrollHeight: string = '650px';

  totalRecords: number = 0;
  recordsPerPage: number = 10;
  first: number = 0;

  first2: number = 0;

  rows2: number = 10;

  first3: number = 0;

  rows3: number = 10;

  options = [
    { label: 5, value: 5 },
    { label: 10, value: 10 },
    { label: 20, value: 20 },
    { label: 120, value: 120 },
  ];

  @ViewChild('dt') dt?: Table;

  disabledEdit: boolean = false;
  disabledDelete: boolean = false;

  constructor(private router: Router, private activeRouter: ActivatedRoute) {}
  ngOnInit(): void {
    this.convertFilterSortAgGridToStandartService.setSpanishLanguagePrimeNg();
    this.updateScrollHeight();
    this.loadDataPagination();
  }

  loadDataPagination() {
    this.loading = true;

    let _sortForBack = this.sortForBack;
    let _filtroForBack: any = [];
    this.paginationService
      .getPaginationAgGrid(
        this.currentPage,
        this.recordsPerPage,
        _filtroForBack,
        _sortForBack,
        'functionalLeader',
        'pagination'
      )
      .subscribe({
        next: (data) => {
          this.rowData = data.content as FunctionalLeaderInterface[];
          this.loading = false;
          this.totalRecords = data.totalElements;
        },
        error: (error: ErrorInterface) => {
          this.notificacionesService.showError(error);
        },
      });
  }

  NewRegistter() {
    this.router.navigate(['functionalLeader-edit', '0'], {
      relativeTo: this.activeRouter.parent,
    });
  }
  edit() {
    let rowData;
    // if (rowData.length == 0) {
    //   return;
    // }
    // let id = rowData[0].idFunctionalLeader;
    // this.router.navigate(['functionalLeader-edit', id], {
    //   relativeTo: this.activeRouter.parent,
    // });
  }
  delete() {
    let id = 0;

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
          this.crudService.deleteById('functionalLeader', '', id).subscribe({
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
    this.first = 0;
    this.currentPage = 0;
    this.sortForBack = [];
    this.filtroForBack = [];
    this.loadDataPagination();
  }

  onPageChange(event: PageEvent) {
    this.first = event.first ?? 0;
    this.recordsPerPage = event.rows ?? 10;
    this.currentPage = event.page ?? 0;
    this.loadDataPagination();
  }

  onGridPageSizeChanged(size: number): void {
    // this.gridApi.cacheBlockSize = size;
    // //// this is a way to use private fields in typescript
    // const api: any = this.gridApi;
    // //api.infinitePageRowModel.resetCache();
    // this.gridApi.paginationPageSize = size;
  }

  onSelectionChanged(e: any) {
    if (e == undefined || e == null) {
      this.disabledEdit = false;
      this.disabledDelete = false;
      return;
    }
    if (e.data != undefined) {
      this.disabledEdit = true;
      this.disabledDelete = true;
    } else {
      this.disabledEdit = false;
      this.disabledDelete = false;
    }
  }

  onSort(e: any) {
    if (e == undefined || e == null) {
      return;
    }
    let sort = e.multisortmeta as [];

    let _sortForBack: PaginationSortInterface[] =
      this.convertFilterSortAgGridToStandartService.ConvertSortPrimeNgToStandar(
        sort
      );
    this.sortForBack = _sortForBack;

    this.loadDataPagination();
  }

  onFilter(e: any) {
    if (e == undefined || e == null) {
      return;
    }
    let filter = e.filters as [];
  }

  onModelChange(e: number) {
    this.recordsPerPage = e;
    this.reload();
  }

  // Detecta cuando se redimensiona la ventana del navegador
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.updateScrollHeight(); // Ajusta el scrollHeight cuando cambia el tamaño de la ventana
  }

  // Función para calcular el scrollHeight dinámicamente
  updateScrollHeight() {
    const availableHeight = window.innerHeight; // Altura disponible de la ventana
    const offset = 600; // Ajuste según el diseño de la página, margenes, encabezados, etc.
    this.scrollHeight = availableHeight - offset + 'px';
  }
}
