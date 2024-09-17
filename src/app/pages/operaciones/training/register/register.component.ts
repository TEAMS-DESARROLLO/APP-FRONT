import { RegisterInterface } from './../register-interface';
import { Component, ElementRef, importProvidersFrom, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { CrudService } from '../../../../providers/crud.service';
import { TipoViaInterface } from '../../../maestros/tipo-via/tipo-via-pagination/tipo-via.interface';
import { MessagesService } from '../../../shared/messages/messages.service';
import { CommonsService } from '../../../shared/services/commons.service';
import { distinctUntilChanged } from 'rxjs';

import { DialogModule } from 'primeng/dialog';

import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';

import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DropDownSharedComponent } from '../../../shared/drop-down-shared/drop-down-shared/drop-down-shared.component';
import { ToolbarSaveQuitComponent } from '../../../shared/toolbar-save-quit/toolbar-save-quit.component';

import { CollaboratorInterface } from '../../../maestros/collaborator/collaborator-pagination/collaborator.interface';

import {MatDatepickerModule} from '@angular/material/datepicker';
import {ChangeDetectionStrategy} from '@angular/core';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule} from '@angular/material/core';
import { MomentDateAdapter,  } from '@angular/material-moment-adapter';

import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import {default as _rollupMoment} from 'moment';
import TipoViaComponent from "../../../maestros/collaborator/collaborator-pagination/collaborator.component";
import { UtilsFechasService } from '../../../../utils/utils.fechas.service';
import CollaboratorComponent from '../../../maestros/collaborator/collaborator-pagination/collaborator.component';


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
  selector: 'app-register',
  standalone: true,
  providers: [
    MatNativeDateModule,
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ],
  imports: [
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatCardModule,
    ToolbarSaveQuitComponent,
    DropDownSharedComponent,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    DialogModule,
    CollaboratorComponent
],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export default class RegisterComponent {
  title = 'Registro de colaborador disponible';
  visible: boolean = false;
  _createRegister: boolean = true;
  seekingBehavior: boolean = true;

  @ViewChild('myDescripcion') inputElement?: ElementRef;

  private crudService = inject(CrudService<TipoViaInterface>);
  private messagesService = inject(MessagesService);
  private commonsService = inject(CommonsService);
  private utilsFechasService = inject(UtilsFechasService);

  collaboratorInteface?: CollaboratorInterface;

  get f() {
    return this.customerForm.controls;
  }

  customerForm: FormGroup = this.fb.group({
    idRegister: [''],
    idCollaborator: ['', Validators.required],
    names: ['', Validators.required],
    lastName: ['', Validators.required],
    idLeader: [''],
    leaderNames: [''],
    idRegion: [''],
    regionDescription: [''],
    idFunctionalLeader: [''],
    functionalLeaderNames: [],
    idCommunity: [''],
    communityDescription: [''],
    dateAdmission: [new Date()],
  });

  get idCommunityForm() {
    return this.customerForm.get('idCommunity') as FormControl;
  }

  frameworkComponents: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activeRouter: ActivatedRoute
  ) {

  }

  ngOnInit() {
    this.loadFromServer();

    setTimeout(() => {
      this.focusInput();
      this.upperCase();
    }, 500);
  }

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

  findCollaborator() {
    const idCollaborator = this.customerForm.controls['idCollaborator'].value; //   580643;
    if (idCollaborator == '' || idCollaborator == undefined) {
      this.customerForm.reset();
      return;
    }

    this.crudService.readById('collaborator', '', idCollaborator).subscribe({
      next: (data) => {
        Object.keys(data).forEach((name) => {
          if (this.customerForm.controls[name]) {
            this.customerForm.controls[name].patchValue(data[name]);
          }
        });
      },
    });
  }

  showCollaborator() {
    this.visible = true;
  }

  focusInput() {
    this.inputElement?.nativeElement.focus();
  }

  upperCase() {
    this.customerForm
      .get('names')
      ?.valueChanges.pipe(distinctUntilChanged())
      .subscribe((value: string) => {
        this.customerForm
          .get('names')
          ?.patchValue(value != null ? value.toUpperCase() : '');
      });

    this.customerForm
      .get('lastName')
      ?.valueChanges.pipe(distinctUntilChanged())
      .subscribe((value: string) => {
        this.customerForm
          .get('lastName')
          ?.patchValue(value != null ? value.toUpperCase() : '');
      });
  }

  loadFromServer(): void {
    this.activeRouter.params.subscribe((params) => {
      let id = params['id'];
      if (id == '0') {
        this._createRegister = true;
      } else {
        this._createRegister = false;
        this.crudService.readById('registration', '', id).subscribe((data) => {
          Object.keys(data).forEach((name) => {
            let nameMap = '';
            switch (name) {
              case 'idRegister':
                nameMap = 'idRegister';
                break;
              case 'idCollaborator':
                nameMap = 'idCollaborator';
                break;
              case 'idRegion':
                nameMap = 'idRegion';
                break;
              case 'descriptionRegion':
                nameMap = 'regionDescription';
                break;
              case 'idCommunity':
                nameMap = 'idCommunity';
                break;
              case 'descriptionCommunity':
                nameMap = 'communityDescription';
                break;

              case 'namesCollaborator':
                nameMap = 'names';
                break;
              case 'lastnameCollaborator':
                nameMap = 'lastName';
                break;
              case 'idFunctionalLeader':
                nameMap = 'idFunctionalLeader';
                break;
              case 'namesFuncionalLeader':
                nameMap = 'functionalLeaderNames';
                break;
              case 'idLeader':
                nameMap = 'idLeader';
                break;
              case 'namesLeader':
                nameMap = 'leaderNames';
                break;
              case 'dateAdmission':
                nameMap = 'dateAdmission';
                break;

              default:
                break;
            }
            if (this.customerForm.controls[nameMap]) {
              this.customerForm.controls[nameMap].patchValue(data[name]);
            }
            if (nameMap == 'dateAdmission') {
              let fecha = data[name];
              let newDate = this.utilsFechasService.convertToDate(fecha, '-');
              this.customerForm.controls[nameMap].patchValue(newDate);
            }
          });
        });
      }
    });
  }

  save() {
    let data = this.customerForm.value;

    let date = this.customerForm.get('dateAdmission')?.value;

    let miFecha = moment(date).format('DD-MM-YYYY');


    let dataform = this.customerForm.value;
    let dataSave: RegisterInterface = {
      idCollaborator: this.customerForm.get('idCollaborator')?.value,
      namesCollaborator: this.customerForm.get('names')?.value,
      lastnameCollaborator: this.customerForm.get('lastName')?.value,

      idLeader: this.customerForm.get('idLeader')?.value,
      namesLeader: this.customerForm.get('leaderNames')?.value,

      idRegion: this.customerForm.get('idRegion')?.value,
      descriptionRegion: this.customerForm.get('regionDescription')?.value,

      idCommunity: this.customerForm.get('idCommunity')?.value,
      descriptionCommunity: this.customerForm.get('communityDescription')
        ?.value,

      idFunctionalLeader: this.customerForm.get('idFunctionalLeader')?.value,
      namesFunctionalLeader: this.customerForm.get('functionalLeaderNames')
        ?.value,

      dateAdmission: miFecha,
    };

    this.crudService.getAll('registration', 'all', '').subscribe((resp) => {
      console.log(resp);
    });

    this.crudService
      .create('registration', 'create', dataSave)
      .subscribe((res) => {
        this.customerForm.reset();
        this.router.navigate(['training-register'], {
          relativeTo: this.activeRouter.parent,
        });
        this.messagesService.message_ok('Grabado', 'Regirstro agregado');
      });
  }

  update() {
    let data = this.customerForm.value;
    let date = this.customerForm.get('dateAdmission')?.value;

    let miFecha = moment(date).format('DD-MM-YYYY');

    let dataSave: RegisterInterface = {
      idCollaborator: this.customerForm.get('idCollaborator')?.value,
      namesCollaborator: this.customerForm.get('names')?.value,
      lastnameCollaborator: this.customerForm.get('lastName')?.value,

      idLeader: this.customerForm.get('idLeader')?.value,
      namesLeader: this.customerForm.get('leaderNames')?.value,

      idRegion: this.customerForm.get('idRegion')?.value,
      descriptionRegion: this.customerForm.get('regionDescription')?.value,

      idCommunity: this.customerForm.get('idCommunity')?.value,
      descriptionCommunity: this.customerForm.get('communityDescription')
        ?.value,

      idFunctionalLeader: this.customerForm.get('idFunctionalLeader')?.value,
      namesFunctionalLeader: this.customerForm.get('functionalLeaderNames')
        ?.value,

      dateAdmission: miFecha,
    };


    let id = this.customerForm.get('idRegister')?.value;
    if (id) {
      this.crudService.update('registration', '', dataSave, id).subscribe({
        next: (resp) => {
          this.customerForm.reset();
          this.messagesService.message_ok('Grabado', 'Regirstro actualizado');
          this.router.navigate(['training-register'], {
            relativeTo: this.activeRouter.parent,
          });
        },
        error: (error) => {},
      });
    }
  }

  quit(e: any) {
    setTimeout(() => {
      this.router.navigate(['training-register'], {
        relativeTo: this.activeRouter.parent,
      });
    }, 500);
  }

  getIdCollaborator(e: number) {
    this.customerForm.get('idCollaborator')?.patchValue(e);
    this.findCollaborator();
    this.visible = false;
  }

  closeModal() {
    this.visible = false;
  }
}
