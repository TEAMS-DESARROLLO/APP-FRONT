import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';

import { PaginationService } from '../../../providers/pagination.service';
import { NotificationsService } from '../services/notifications.service';
import { ErrorInterface } from '../../../utils/interfaces/errorInterface';


interface PageEvent {
  page?: number;
  first?: number;
  rows?: number;
  pageCount?: number;
}

interface PaginationSortInterface {
  colName: String;
  sort: String;
}


@Component({
  selector: 'app-grid-pagination-primeng-custom',
  standalone: true,
  imports: [CommonModule, TableModule, PaginatorModule],
  templateUrl: './grid-pagination-primeng-custom.component.html',
  styleUrl: './grid-pagination-primeng-custom.component.css',
})
export class GridPaginationPrimengCustomComponent implements OnChanges {
  private paginationService = inject(PaginationService);
  private notificacionesService = inject(NotificationsService);

  @Input()
  flagReload: boolean = false;

  @Input()
  controller: string = '';

  @Input()
  event: string = '';

  @Input()
  propertiesGrid: any = [
    {
      title: 'Codigos',
      propertyColumn: 'idPractice',
      style: { width: '150px' },
    },
    {
      title: 'Descripcion',
      propertyColumn: 'description',
      style: { flex: '1' },
    },
  ];

  @Output()
  _onSelectionChanged: EventEmitter<any> = new EventEmitter();

  rowData: any = [];
  loading: boolean = false;
  scrollHeight: string = '650px';
  selectedRow: boolean = false;

  recordsPerPage: number = 10;
  totalRecords: number = 0;
  currentPage: number = 0;
  first: number = 0;

  offsetScrollInit = 600;
  rows2: number = 10;
  selectedEntity!: any;
  metaKey: boolean = true;
  dataKey: string = '';
  globalFilterFields: any = [];

  filtroForBack: any = [];
  sortForBack: any = [];

  options = [
    { label: 5, value: 5 },
    { label: 10, value: 10 },
    { label: 20, value: 20 },
    { label: 120, value: 120 },
  ];

  constructor() {
    this.dataKey = this.propertiesGrid[0].propertyColumn;
    this.propertiesGrid.forEach((element: any) => {
      this.globalFilterFields.push(element.propertyColumn);
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.reload();
  }


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

  onSelectionChanged(e: any) {

    let infoSelected = null;
    if (e == undefined || e == null) {
      this.selectedRow = false;
    }else if (e.data != undefined) {
      this.selectedRow = true;
      infoSelected = e.data;
    }


    const data = {
      selectedRow: this.selectedRow,
      data: infoSelected,
    };

    this._onSelectionChanged.emit(data);
  }

  onSort(e: any) {

    if (e == undefined || e == null) {
      return;
    }
    let sort = e.multisortmeta as [];

    let _sortForBack: PaginationSortInterface[] =
      this.ConvertSortPrimeNgToStandar(sort);
    this.sortForBack = _sortForBack;

    this.loadDataPagination();
  }

  onFilter(e: any) {

    this.filtroForBack = this.ConvertFilterPrimeNgToStandar(e);
    this.loadDataPagination();
  }

  onModelChange(e: number) {

    this.recordsPerPage = e;
    this.updateScrollHeight();
  }


  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.updateScrollHeight();
  }

  // Función para calcular el scrollHeight dinámicamente
  updateScrollHeight() {
    const availableHeight = window.innerHeight; // Altura disponible de la ventana
    let offset = availableHeight * 0.35; // Ajuste según el diseño de la página, margenes, encabezados, etc.

    this.scrollHeight = availableHeight - offset + 'px';
    const porcentajeActual = offset / availableHeight;

    offset = availableHeight * porcentajeActual;
    this.offsetScrollInit = offset;
    this.scrollHeight = availableHeight - offset + 'px';
  }

  ConvertSortPrimeNgToStandar(sort: []) {
    let arraySort: PaginationSortInterface[] = [];

    sort.forEach((element) => {
      let sorter = 'asc';
      if (element['order'] == 1) {
        sorter = 'asc';
      } else if (element['order'] == -1) {
        sorter = 'desc';
      }

      let sort: PaginationSortInterface = {
        colName: element['field'],
        sort: sorter,
      };
      arraySort.push(sort);
    });
    return arraySort;
  }

  ConvertFilterPrimeNgToStandar(e: any) {
    if (e == undefined || e == null) {
      return [];
    }
    let filters = e.filters;
    let _filtroForBack: any = [];
    for (let key in filters) {
      if (filters.hasOwnProperty(key)) {
        let filter = filters[key];
        if (filter[0].value != null && filter[0].value != undefined) {
          _filtroForBack.push({
            field: key,
            value: filter[0].value,
            matchMode: filter[0].matchMode,
          });
        }
      }
    }
    if (_filtroForBack.length == 0) {
      return [];
    }
    return _filtroForBack;
  }

  loadDataPagination() {
    this.loading = true;

    let _sortForBack = this.sortForBack;
    let _filtroForBack = this.filtroForBack;
    this.paginationService
      .getPaginationAgGrid(
        this.currentPage,
        this.recordsPerPage,
        _filtroForBack,
        _sortForBack,
        this.controller,
        this.event
      )
      .subscribe({
        next: (data) => {
          this.rowData = data.content; //as FunctionalLeaderInterface[];
          this.loading = false;
          this.totalRecords = data.totalElements;
        },
        error: (error: ErrorInterface) => {
          this.notificacionesService.showError(error);
        },
      });
  }
}
