import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, ActivatedRoute } from '@angular/router';
import { distinctUntilChanged } from 'rxjs';
import { CrudService } from '../../../../providers/crud.service';
import { ViaInterface } from '../../../maestros/via/via-pagination/via.interface';
import { DropDownSharedComponent } from '../../../shared/drop-down-shared/drop-down-shared/drop-down-shared.component';
import { DataSoureDropDownComboInterface } from '../../../shared/interfaces/datasource-dropdown-interface';
import { MessagesService } from '../../../shared/messages/messages.service';
import { CommonsService } from '../../../shared/services/commons.service';
import { ToolbarSaveQuitComponent } from '../../../shared/toolbar-save-quit/toolbar-save-quit.component';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { ChangeDetectionStrategy } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';


import { MatTableModule } from '@angular/material/table';

import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment } from 'moment';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RegisterFollowUpInterface } from '../register-follow-up-interface';
import { UtilsFechasService } from '../../../../utils/utils.fechas.service';
import { NotificationsService } from '../../../shared/services/notifications.service';
import { AssignedCourseRegistration } from '../Assigned-course-registration-interface';
import { AssignedCourseRegistrationComponent } from "./components/assigned-course-registration/assigned-course-registration.component";
import { InfoBaseCollaboratorComponent } from "../../../maestros/collaborator/components/shared/info-base-collaborator/info-base-collaborator.component";
import { CollaboratorInterface } from '../../../maestros/collaborator/collaborator-pagination/collaborator.interface';
import { ProvidersCollaboratorService } from '../../../maestros/collaborator/providers-collaborator.service';
import { RegisterCourseDetailsAdvanceComponent } from '../register-course-details-advance/register-course-details-advance.component';
import { DialogModule } from 'primeng/dialog';
import { AssignedCourseRegistrationService } from '../../service/assigned-course-registration.service';

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



@Component({
  selector: 'app-training-follow-up',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatCardModule,
    ToolbarSaveQuitComponent,
    DropDownSharedComponent,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    DialogModule,
    AssignedCourseRegistrationComponent,
    InfoBaseCollaboratorComponent,
    RegisterCourseDetailsAdvanceComponent,
  ],
  templateUrl: './training-follow-up.component.html',
  styleUrl: './training-follow-up.component.css',
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
export default class TrainingFollowUpComponent {
  @ViewChild('myDescripcion') inputElement?: ElementRef;

  private crudService = inject(CrudService<ViaInterface>);
  private messagesService = inject(MessagesService);
  private commonsService = inject(CommonsService);

  private utilsFechasService = inject(UtilsFechasService);
  private notificacionesService = inject(NotificationsService);
  private providersCollaboratorService = inject(ProvidersCollaboratorService);

  private assignedCourseRegistrationService = inject(
    AssignedCourseRegistrationService
  );

  /** varialbles del componente */
  title = 'INICIO DE FORMACION';

  flagShowCourser: boolean = false;

  _createRegister: boolean = false;
  dataTipoVia: DataSoureDropDownComboInterface[] = [];
  formulario: any;
  get f() {
    return this.customerForm.controls;
  }

  customerForm: FormGroup = this.fb.group({
    idRegisterFollow: ['0', Validators.required],
    idRegister: ['0', Validators.required],
    idCollaborator: ['', Validators.required],
    namesCollaborator: ['', Validators.required],
    lastnameCollaborator: ['', Validators.required],
    idRegion: ['', Validators.required],
    descriptionRegion: ['', Validators.required],
    idCommunity: ['', Validators.required],
    descriptionCommunity: ['', Validators.required],
    idLeader: ['', Validators.required],
    namesLeader: ['A', Validators.required],
    dateStartFollow: [new Date(), Validators.required],
    observation: ['', Validators.required],
  });

  courseForm: FormGroup = this.fb.group({
    nameCourse: ['', Validators.required],
    durationHrs: ['', Validators.required],
    url: ['', Validators.required],
    dateStartCourse: ['', Validators.required],
  });

  get idTipoViaForm() {
    return this.customerForm.get('idTipoVia') as FormControl;
  }

  requestCourse = {
    advancePercentage: 0,
    durationCourse: 0,
    nameCourse: '',
    observation: '',
    startDate: '',
    urlCourse: 'string',
    idRegisterFollow: 0,
  };

  flagRender: number = Math.random();

  dataCollaborator!: CollaboratorInterface;
  numberRamdom: number = Math.random();
  visible: boolean = false;

  _assignedCourseRegistration: AssignedCourseRegistration = {
    idAssignedCourseRegistration: 0,
    idRegisterFollow: 0,
    nameCourse: '',
    startDate: '',
    durationCourseMin: 0,
    durationCourseHrs: 0,
    urlCourse: '',
    observation: '',
    advancePercentage: 0,
    idAssignedCourseRegistrationDetail: 0,
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activeRouter: ActivatedRoute
  ) {}

  onExit() {
    if (this.customerForm.dirty) {
      return this.messagesService
        .message_question(
          'question',
          'Cuidado!',
          'Estas seguros de salir sin grabar cambios',
          'Si, Estoy seguro',
          'No, cancelar'
        )
        .then((res) => {
          if (!res) {
            setTimeout(() => {
              this.focusInput();
              this.upperCase();
            }, 500);
          }
          return res;
        });
    }
    return true;
  }

  ngOnInit() {
    this.loadFromServer();

    setTimeout(() => {
      this.focusInput();
      this.upperCase();
    }, 500);
  }

  upperCase() {
    this.customerForm
      .get('descripcion')
      ?.valueChanges.pipe(distinctUntilChanged())
      .subscribe((value: string) => {
        this.customerForm
          .get('descripcion')
          ?.patchValue(value != null ? value.toUpperCase() : '');
      });
  }

  focusInput() {
    this.inputElement?.nativeElement.focus();
  }

  loadFromServer(): void {
    this.activeRouter.params.subscribe((params) => {
      let id = params['id'];
      if (id == '0') {
        this._createRegister = true;
      } else {
        this._createRegister = false;

        this.crudService.readById('registration', '', id).subscribe((data) => {
          this.dataCollaborator =
            this.providersCollaboratorService.fillInterfaceCollaboratorFromRequest(
              data
            );

          this.numberRamdom = Math.random();

          Object.keys(data).forEach((name) => {
            if (this.customerForm.controls[name]) {
              this.customerForm.controls[name].patchValue(data[name]);
            }
          });
          this.loadRegisterFollowUp(data['idRegister']);
        });
      }
    });
  }

  loadRegisterFollowUp(idRegister: number) {
    this.crudService
      .readById('registrationFollow', '/search', idRegister)
      .subscribe({
        next: (resp) => {
          let registerFollowUp: RegisterFollowUpInterface = {
            idRegisterFollow: 0,
            idRegister: 0,
            dateStartFollow: '',
            observation: '',
          };

          registerFollowUp.idRegisterFollow = resp['idRegisterFollow'];
          registerFollowUp.idRegister = resp['idRegister'];
          registerFollowUp.dateStartFollow = resp['dateStartFollow'];
          registerFollowUp.observation = resp['observation'];
          registerFollowUp.idRegisterFollow = resp['idRegisterFollow'];

          let date = this.utilsFechasService.convertToDate(
            registerFollowUp.dateStartFollow,
            '-'
          );
          this.customerForm.get('dateStartFollow')?.patchValue(date);

          let observation = registerFollowUp.observation;
          this.customerForm.get('observation')?.patchValue(observation);

          let idRegisterFollow = registerFollowUp.idRegisterFollow;
          this.customerForm
            .get('idRegisterFollow')
            ?.patchValue(idRegisterFollow);

          this.flagShowCourser = true;
        },
        error: (error) => {},
      });
  }

  saveFollow(tegisterFollowUpInterface: RegisterFollowUpInterface) {
    let id = tegisterFollowUpInterface.idRegisterFollow;
    this.crudService
      .update('registrationFollow', '', tegisterFollowUpInterface, id)
      .subscribe((res) => {
        this.notificacionesService.showAlert('Registro actualizado', 3000, 0);
      });
  }

  update() {
    let data = this.customerForm.value;

    let id = this.customerForm.get('idVia')?.value;
    if (id) {
      this.crudService.update('via', '', data, id).subscribe({
        next: (resp) => {
          this.customerForm.reset();
          this.messagesService.message_ok('Grabado', 'Regirstro actualizado');
          this.router.navigate(['via'], {
            relativeTo: this.activeRouter.parent,
          });
        },
        error: (error) => {},
      });
    }
  }

  quit(e: any) {
    setTimeout(() => {
      this.router.navigate(['via'], { relativeTo: this.activeRouter.parent });
    }, 500);
  }

  change(event: any) {
    let date = this.customerForm.get('dateStartFollow')?.value;

    let miFecha = moment(date).format('DD-MM-YYYY');

    let registerFollowUp: RegisterFollowUpInterface = {
      idRegisterFollow: this.customerForm.get('idRegisterFollow')?.value,
      idRegister: this.customerForm.get('idRegister')?.value,
      dateStartFollow: miFecha,
      observation: this.customerForm.get('observation')?.value,
    };

    switch (event.target.id) {
      case 'textAreaObservacion':
        registerFollowUp.observation = event.target.value;
        this.saveFollow(registerFollowUp);
        break;

      default:
        break;
    }
  }

  changeDateStartFollow(event: any) {
    let date = this.customerForm.get('dateStartFollow')?.value;

    let miFecha = moment(date).format('DD-MM-YYYY');

    let registerFollowUp: RegisterFollowUpInterface = {
      idRegisterFollow: this.customerForm.get('idRegisterFollow')?.value,
      idRegister: this.customerForm.get('idRegister')?.value,
      dateStartFollow: miFecha,
      observation: this.customerForm.get('observation')?.value,
    };
    this.saveFollow(registerFollowUp);
  }

  agregarCurso() {
    if (!this.validarDattosCurso()) {
      return;
    }

    let data = this.courseForm.value;
    let nameCourse = data.nameCourse;
    let duration = data.durationHrs;
    let url = data.url;
    let dateStartCourse = data.dateStartCourse;

    let miFecha = moment(dateStartCourse).format('DD-MM-YYYY');

    let idRegisterFollow = this.customerForm.get('idRegisterFollow')?.value;

    this.requestCourse.advancePercentage = 0;
    this.requestCourse.durationCourse = duration;
    this.requestCourse.nameCourse = nameCourse;
    this.requestCourse.observation = '';
    this.requestCourse.startDate = miFecha;
    this.requestCourse.urlCourse = url;
    this.requestCourse.idRegisterFollow = idRegisterFollow;

    //let date = this.customerForm.get('dateAdmission')?.value;

    this.crudService
      .create('assignedCourseRegistration', 'create', this.requestCourse)
      .subscribe({
        next: (resp) => {
          this.flagRender = Math.random();
          this.notificacionesService.showAlert('Curso registrado', 3000, 0);

          this.courseForm.reset({
            nameCourse: '',
            durationHrs: '',
            url: '',
            dateStartCourse: '',
          });
        },
        error: (error) => {},
      });
  }

  validarDattosCurso() {
    let data = this.courseForm.value;
    let nameCourse = data.nameCourse;
    let duration = data.duration;
    let url = data.url;
    let dateStartCourse = data.dateStartCourse;

    if (nameCourse == '') {
      this.notificacionesService.showAlert(
        'Nombre del curso es requerido',
        3000,
        0
      );
      return false;
    }

    if (duration == '') {
      this.notificacionesService.showAlert(
        'Duración del curso es requerido',
        3000,
        0
      );
      return false;
    }

    if (url == '') {
      this.notificacionesService.showAlert(
        'Url del curso es requerido',
        3000,
        0
      );
      return false;
    }

    if (dateStartCourse == '') {
      this.notificacionesService.showAlert(
        'Fecha de inicio del curso es requerido',
        3000,
        0
      );
      return false;
    }

    return true;
  }

  showPopupInfoThemesForCourse(e: AssignedCourseRegistration) {

    if (e.nameCourse == undefined) {
      return;
    }

    this.assignedCourseRegistrationService.assignedCourseRegistration = e;

    this.visible = true;
  }
}

