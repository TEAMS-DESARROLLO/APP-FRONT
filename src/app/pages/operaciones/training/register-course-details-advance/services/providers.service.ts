import { inject, Injectable } from '@angular/core';
import { CrudService } from '../../../../../providers/crud.service';
import { AssignedCourseRegistrationService } from '../../../service/assigned-course-registration.service';
import { MessagesService } from '../../../../shared/messages/messages.service';
import { Subject } from 'rxjs';
import { CourseDetailResponseInterface } from '../components/course-detail-add/course-detail-response.interface';
import { AssignedCourseRegistration } from '../../Assigned-course-registration-interface';

@Injectable({
  providedIn: 'root',
})
export class ProvidersService {
  private crudService = inject(CrudService);
  private messagesService = inject(MessagesService);

  assignedCourseRegistrationService = inject(AssignedCourseRegistrationService);

  idCourseRegistration: number = 0;
  rowData$ = new Subject<CourseDetailResponseInterface[]>();
  rowDataTheme$ = new Subject<CourseDetailResponseInterface>();


  constructor() {


  }

  loadThemesForCourse() {
    this.idCourseRegistration =
      this.assignedCourseRegistrationService.assignedCourseRegistration.idAssignedCourseRegistration;
      if(this.idCourseRegistration ==undefined)
        console.log('idCourseRegistration is undefined');

    this.crudService
      .readById(
        'assignedCourseRegistrationDetail',
        'AssignedCourseRegistration',
        this.idCourseRegistration
      )
      .subscribe({
        next: (data: CourseDetailResponseInterface[]) => {
          this.rowData$.next(data);
        },

        error: (error) => {
          this.messagesService.message_error('Atencion', error.message);
          return [];
        },
      });
  }

  loadThemesForCourseById(id: number) {

    this.crudService
      .readById('assignedCourseRegistrationDetail', '', id)
      .subscribe({
        next: (data: CourseDetailResponseInterface) => {
          this.rowDataTheme$.next(data);
        },

        error: (error) => {
          this.messagesService.message_error('Atencion', error.message);
          return [];
        },
      });
  }
}
