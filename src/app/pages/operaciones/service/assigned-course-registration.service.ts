import { Injectable } from '@angular/core';
import { AssignedCourseRegistration } from '../training/Assigned-course-registration-interface';

@Injectable({
  providedIn: 'root',
})
export class AssignedCourseRegistrationService {

  assignedCourseRegistration: AssignedCourseRegistration= {
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



  constructor() {

  }
}
