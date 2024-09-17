import { CommonModule } from '@angular/common';
import { Component, inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule, } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { NotificationsService } from '../../../../../shared/services/notifications.service';
import { CrudService } from '../../../../../../providers/crud.service';
import { AssignedCourseRegistrationService } from '../../../../service/assigned-course-registration.service';
import { ProvidersService } from '../../services/providers.service';
import { AssignedCourseRegistration } from '../../../Assigned-course-registration-interface';
import { CourseDetailResponseInterface } from './course-detail-response.interface';
import { UtilsFechasService } from '../../../../../../utils/utils.fechas.service';

const moment = _rollupMoment || _moment;

const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

const httpRequest = {
  idAssignedCourseRegistration: 0,
  themeOfDay: '',
  comment: '',
  reportDate: '',
  durationCourseHrs: 0,
  durationCourseMin: 0,
};


@Component({
  selector: 'app-course-detail-add',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
  ],
  templateUrl: './course-detail-add.component.html',
  styleUrl: './course-detail-add.component.css',
  providers: [
    MatNativeDateModule,
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ],
})
export class CourseDetailAddComponent implements OnInit, OnChanges {
  get f() {
    return this.customerForm.controls;
  }

  customerForm: FormGroup = this.fb.group({
    idAssignedCourseRegistrationDetail: [0],
    temaRevisado: ['', Validators.required],
    hrsDedicadas: [
      0,
      [Validators.required, Validators.pattern('^[0-9]*$'), Validators.max(10)],
    ],
    minDedicadas: [
      0,
      [Validators.required, Validators.pattern('^[0-9]*$'), Validators.max(60)],
    ],
    dateImputation: [new Date(), Validators.required],
    comment: ['', Validators.required],
  });

  flagHrsMin = false;

  private notificacionesService = inject(NotificationsService);
  private crudService = inject(CrudService);

  private assignedCourseRegistrationService = inject(
    AssignedCourseRegistrationService
  );
  private providersService = inject(ProvidersService);
  private utilsFechasService = inject(UtilsFechasService);

  rowData: CourseDetailResponseInterface = {
    idAssignedCourseRegistrationDetail:0,
    reportDate:"",
    themeOfDay:"",

    durationCourseHrs:0,
    durationCourseMin:0,
    comment:""
  };

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.providersService.rowDataTheme$.subscribe(
      (data: CourseDetailResponseInterface) => {

        this.rowData = data;
        this.showDataWhenEditCourse();
      }
    );
  }

  showDataWhenEditCourse() {

      let fecha = this.rowData.reportDate;
      let newDate = this.utilsFechasService.convertToDate(fecha, '-');
      //this.customerForm.controls[nameMap].patchValue(newDate);


    this.customerForm.patchValue({

      temaRevisado: this.rowData.themeOfDay,
      hrsDedicadas: this.rowData.durationCourseHrs,
      minDedicadas: this.rowData.durationCourseMin,
      //dateImputation: this.rowData.reportDate,
      dateImputation: newDate,
      comment: this.rowData.comment,




    });
  }

  ngOnChanges(changes: SimpleChanges): void {}

  // showDataWhenEditCourse() {
  //   this.customerForm.patchValue({
  //     temaRevisado: this.rowData.themeOfDay,
  //     hrsDedicadas: this.rowData.durationCourseHrs,
  //     minDedicadas: this.rowData.durationCourseMin,
  //     dateImputation: this.rowData.reportDate,
  //     comment: this.rowData.comment,
  //   });
  // }

  validarDatosImputacion() {
    let data = this.customerForm.value;
    let temaRevisado = data.temaRevisado;
    let hrsDedicadas: number = data.hrsDedicadas;
    let minDedicadas: number = data.minDedicadas;
    let dateStartFollow = data.dateStartFollow;
    let observation = data.observation;

    if (temaRevisado == '') {
      this.notificacionesService.showAlert(
        'Tema revisado del curso es requerido',
        3000,
        0
      );
      return false;
    }

    if (hrsDedicadas == undefined || hrsDedicadas == null) {
      this.notificacionesService.showAlert(
        'Horas dedicadas del curso es requerido',
        3000,
        0
      );
      return false;
    }

    if (minDedicadas == undefined || minDedicadas == null) {
      this.notificacionesService.showAlert(
        'Minutos dedicados del curso es requerido',
        3000,
        0
      );
      return false;
    }

    if (hrsDedicadas == 0 && minDedicadas == 0) {
      this.notificacionesService.showAlert(
        'Horas o minutos dedicados del curso es requerido',
        3000,
        0
      );
      return false;
    }

    if (dateStartFollow == '') {
      this.notificacionesService.showAlert(
        'Fecha de aplicacion es requerido',
        3000,
        0
      );
      return false;
    }

    if (observation == '') {
      this.notificacionesService.showAlert(
        'Comentarios de la aplicacion es requerido',
        3000,
        0
      );
      return false;
    }

    return true;
  }

  agregarImputacion() {
    if (this.validarDatosImputacion()) {
      console.log('Datos validos');

      let data = this.customerForm.value;

      let miFecha = moment(data.dateImputation).format('DD-MM-YYYY');

      httpRequest.themeOfDay = data.temaRevisado;
      httpRequest.durationCourseHrs = data.hrsDedicadas;
      httpRequest.durationCourseMin = data.minDedicadas;
      httpRequest.reportDate = miFecha;
      httpRequest.comment = data.comment;
      httpRequest.idAssignedCourseRegistration =
        this.assignedCourseRegistrationService.assignedCourseRegistration.idAssignedCourseRegistration;



      this.crudService
        .create('assignedCourseRegistrationDetail', 'create', httpRequest)
        .subscribe((response) => {
          this.providersService.loadThemesForCourse();
          this.notificacionesService.showAlert(
            'Imputacion agregada correctamente',
            3000,
            1
          );
          this.customerForm.reset();
        });
    }
  }
}
