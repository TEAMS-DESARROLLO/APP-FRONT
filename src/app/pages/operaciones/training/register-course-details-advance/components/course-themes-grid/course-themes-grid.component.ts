import { Component, inject, Input, OnInit } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular';
import { CrudService } from '../../../../../../providers/crud.service';
import { ColDef, SelectionChangedEvent } from 'ag-grid-community';
import { AssignedCourseRegistration } from '../../../Assigned-course-registration-interface';
import { CommonModule } from '@angular/common';
import { AssignedCourseRegistrationService } from '../../../../service/assigned-course-registration.service';
import { UnsubscriptionError } from 'rxjs';
import { ProvidersService } from '../../services/providers.service';
import { ButtonEditDeleteComponent } from '../../../../../shared/button-edit-delete/button-edit-delete.component';
import { CourseDetailResponseInterface } from '../course-detail-add/course-detail-response.interface';
import { NotificationsService } from '../../../../../shared/services/notifications.service';

@Component({
  selector: 'app-course-themes-grid',
  standalone: true,
  imports: [CommonModule, AgGridModule],
  templateUrl: './course-themes-grid.component.html',
  styleUrl: './course-themes-grid.component.css',
})
export class CourseThemesGridComponent implements OnInit {
  httpRequest = {
    idAssignedCourseRegistration: 0,
    themeOfDay: '',
    comment: '',
    reportDate: '',
    durationCourseHrs: 0,
    durationCourseMin: 0,
  };

  @Input()
  idFollowUp!: number;

  @Input()
  flagRender: number = 0;

  themeClass = 'ag-theme-quartz-dark';

  gridParams: any;
  gridApi: any;
  gridColumnApi: any;
  currentPage: number = 0;
  dataSource: any;
  floatingFilter: boolean = false;
  countOnPagination: number = 0;

  rowData!: CourseDetailResponseInterface[];

  loadingCellRendererParams = { loadingMessage: 'One moment please...' };
  loadingOverlayComponentParams = { loadingMessage: 'One moment please...' };

  colDefs: ColDef[] = [
    {
      field: 'themeOfDay',
      headerName: 'Tema desarrollado',
      checkboxSelection: true,
      editable: true,
      filter: true,
      width: 260,
    },
    {
      field: 'durationCourseHrs',
      headerName: 'Imputacion Hrs.',
      editable: true,
      filter: true,
      cellStyle: { textAlign: 'center' },
      width: 155,
    },
    {
      field: 'durationCourseMin',
      headerName: 'Imputacion Min.',
      editable: true,
      filter: true,
      cellStyle: { textAlign: 'center' },
      width: 158,
    },
    {
      field: 'reportDate',
      headerName: 'Fecha de reporte',
      editable: true,
      filter: true,
      width: 220,
    },
    {
      field: 'comment',
      headerName: 'Comentario',
      filter: true,
      editable: true,
      flex: 1,
    },

    {
      headerName: 'Accion',
      field: 'tpriId',
      width: 130,
      cellRenderer: ButtonEditDeleteComponent,
    },
  ];
  disabledEdit: boolean = false;
  disabledDelete: boolean = false;
  diabledSelect: boolean = false;
  dataPagination: any;
  context: any;

  idCourseRegistration: number = 0;

  totalMinutesAsigned: number = 0;
  totalMinutesImputed: number = 0;
  advancedCourse : number = 0;

  assignedCourseRegistrationService = inject(AssignedCourseRegistrationService);
  private crudService = inject(CrudService);
  private providersService = inject(ProvidersService);
  private notificacionesService = inject(NotificationsService);

  data: any;

  constructor() {
    this.context = { componentParent: this };
    this.rowData = [];
    this.idCourseRegistration =
      this.assignedCourseRegistrationService.assignedCourseRegistration.idAssignedCourseRegistration;

    this.totalMinutesAsigned = this.assignedCourseRegistrationService.assignedCourseRegistration.durationCourseHrs * 60;

  }
  ngOnInit(): void {
    this.providersService.rowData$.subscribe(
      (data: CourseDetailResponseInterface[]) => {
        this.rowData = data;

        let totalMinutes = data.reduce((sum, current) => sum + (current.durationCourseHrs * 60 + current.durationCourseMin), 0);

        this.totalMinutesImputed = totalMinutes ;

        this.advancedCourse = this.totalMinutesImputed / this.totalMinutesAsigned * 100;


      }
    );
    this.providersService.loadThemesForCourse();
  }

  onCellClickedDelete(row: AssignedCourseRegistration) {
    console.log('Delete', row);

    this.providersService.loadThemesForCourseById(
      row.idAssignedCourseRegistrationDetail
    );
  }
  onCellClickedEdit(row: AssignedCourseRegistration) {


    this.providersService.loadThemesForCourseById(
      row.idAssignedCourseRegistrationDetail
    );
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
  onCellValueChanged($event: any) {

    let data = $event.data as CourseDetailResponseInterface;

    let miFecha = data.reportDate;

    this.httpRequest.themeOfDay = data.themeOfDay;
    this.httpRequest.durationCourseHrs = data.durationCourseHrs;
    this.httpRequest.durationCourseMin = data.durationCourseMin;
    this.httpRequest.reportDate = miFecha;
    this.httpRequest.comment = data.comment;
    this.httpRequest.idAssignedCourseRegistration =
      this.assignedCourseRegistrationService.assignedCourseRegistration.idAssignedCourseRegistration;


    this.crudService
      .update(
        'assignedCourseRegistrationDetail',
        '',
        this.httpRequest,
        data.idAssignedCourseRegistrationDetail
      )
      .subscribe((response) => {
        this.providersService.loadThemesForCourse();
        this.notificacionesService.showAlert(
          'Imputacion Modificado correctamente',
          3000,
          1
        );
      });
  }
}
