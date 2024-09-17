import { Component, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CourseInfoComponent } from './components/course-info/course-info.component';
import { CourseThemesGridComponent } from "./components/course-themes-grid/course-themes-grid.component";
import { CourseDetailAddComponent } from "./components/course-detail-add/course-detail-add.component";

import { AssignedCourseRegistration } from '../Assigned-course-registration-interface';
import { AssignedCourseRegistrationService } from '../../service/assigned-course-registration.service';
import { ProvidersService } from './services/providers.service';



@Component({
  selector: 'app-register-course-details-advance',
  standalone: true,
  imports: [
    CourseInfoComponent,
    CourseThemesGridComponent,
    CourseDetailAddComponent,
  ],
  templateUrl: './register-course-details-advance.component.html',
  styleUrl: './register-course-details-advance.component.css',
})
export class RegisterCourseDetailsAdvanceComponent
  implements OnInit, OnChanges
{
  @Input()
  _assignedCourseRegistration: AssignedCourseRegistration = {
    idAssignedCourseRegistration: 0,
    idRegisterFollow: 0,
    advancePercentage: 0,
    durationCourseHrs: 0,
    durationCourseMin: 0,
    nameCourse: '',
    observation: '',
    startDate: '',
    urlCourse: '',
    idAssignedCourseRegistrationDetail: 0,
  };

  assignedCourseRegistrationService = inject(AssignedCourseRegistrationService);
  providersService = inject(ProvidersService);
  rowData: any;

  constructor() {}

  ngOnInit(): void {

  }

  ngOnChanges(): void {}
}
