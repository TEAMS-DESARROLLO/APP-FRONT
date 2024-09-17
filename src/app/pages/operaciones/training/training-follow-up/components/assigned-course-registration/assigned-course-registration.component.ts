import { Component, EventEmitter, inject, Inject, Input, Output } from '@angular/core';
import { AssignedCourseRegistration } from '../../../Assigned-course-registration-interface';
import { ColDef, GridOptions, SelectionChangedEvent } from 'ag-grid-community';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { CrudService } from '../../../../../../providers/crud.service';
import { setThrowInvalidWriteToSignalError } from '@angular/core/primitives/signals';
import { BtnShowDetailsCourseFollowComponent } from './btn-show-details-course-follow/btn-show-details-course-follow.component';
import { RegisterPaginationInterface } from '../../../register-pagination-interface';

@Component({
  selector: 'app-assigned-course-registration',
  standalone: true,
  imports: [CommonModule, AgGridModule],
  templateUrl: './assigned-course-registration.component.html',
  styleUrl: './assigned-course-registration.component.css',
})
export class AssignedCourseRegistrationComponent {
  title = 'COLABORADORES EN DISPONIBILIDAD';

  @Input()
  idFollowUp!: number;

  @Input()
  rowCourseSelected!: any;

  @Input()
  flagRender: number = 0;

  @Output()
  _visible = new EventEmitter<boolean>();

  @Output()
  _rowSelectedAssignedCourseRegistration =
    new EventEmitter<AssignedCourseRegistration>();

  themeClass = 'ag-theme-quartz-dark';

  gridParams: any;
  gridApi: any;
  gridColumnApi: any;
  currentPage: number = 0;
  dataSource: any;
  floatingFilter: boolean = false;
  countOnPagination: number = 0;

  rowData!: AssignedCourseRegistration[];

  loadingCellRendererParams = { loadingMessage: 'One moment please...' };
  loadingOverlayComponentParams = { loadingMessage: 'One moment please...' };

  gridOptions: GridOptions = {
    // pagination: true,
    rowModelType: 'infinite',
    maxBlocksInCache: 1,
    cacheBlockSize: 10,
    paginationPageSize: 10,
    suppressHorizontalScroll: false,

    // paginationPageSizeSelector: [10, 20, 100],
  };

  colDefs: ColDef[] = [
    {
      field: 'nameCourse',
      headerName: 'Nombre del Curso',
      checkboxSelection: true,
      filter: true,
      width: 260,
    },
    {
      field: 'durationCourseHrs',
      headerName: 'Duracion Hrs.',
      filter: true,
      width: 155,
    },
    {
      field: 'urlCourse',
      headerName: 'url',
      filter: true,
      width: 220,
    },
    {
      field: 'startDate',
      headerName: 'Fecha Inicio',
      filter: true,
      width: 150,
    },

    {
      headerName: 'Accion',
      field: 'tpriId',
      width: 130,
      cellRenderer: BtnShowDetailsCourseFollowComponent,
    },
  ];
  disabledEdit: boolean = false;
  disabledDelete: boolean = false;
  diabledSelect: boolean = false;
  dataPagination: any;
  context: any;

  private crudService = inject(CrudService);

  constructor() {
    this.context = { componentParent: this };
    this.rowData = [];
  }

  ngOnInit() {
    this.cargarDatos();
  }

  ngOnChanges() {
    this.cargarDatos();
  }

  onSelectionChanged($event: SelectionChangedEvent<any, any>) {
    // if (this.gridApi.getSelectedRows().length > 0) {
    //   this.disabledEdit = true;
    //   this.disabledDelete = true;
    //   this.diabledSelect = true;
    // } else {
    //   this.disabledEdit = false;
    //   this.disabledDelete = false;
    //   this.diabledSelect = false;
    // }
  }

  cargarDatos() {
    this.crudService
      .readById('assignedCourseRegistration', 'followUp', this.idFollowUp)
      .subscribe((data) => {
        this.rowData = data;
      });
  }


  onCellClickedInformation($event: AssignedCourseRegistration) {

    this._rowSelectedAssignedCourseRegistration.emit($event);
  }
}
