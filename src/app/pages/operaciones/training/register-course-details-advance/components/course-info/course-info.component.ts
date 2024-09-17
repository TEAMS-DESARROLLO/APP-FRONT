import { Component, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { AssignedCourseRegistrationService } from '../../../../service/assigned-course-registration.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AssignedCourseRegistrationInterface } from '../../interfaces/assigned-course-registration-Interface';

@Component({
  selector: 'app-course-info',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './course-info.component.html',
  styleUrl: './course-info.component.css',
})
export class CourseInfoComponent implements OnInit, OnChanges {
  @Input()
  _assignedCourseRegistrationInterface!: AssignedCourseRegistrationInterface;
  courseName: string = '';
  startDate: string = '';
  durationCourseHrs: number = 0;
  urlCourse: string = '';
  assignedCourseRegistrationService = inject(AssignedCourseRegistrationService);

  constructor() {
    let data =
      this.assignedCourseRegistrationService.assignedCourseRegistration;

    this.courseName = data.nameCourse;
    this.startDate = data.startDate;
    this.durationCourseHrs = data.durationCourseHrs;
    this.urlCourse = data.urlCourse;
  }

  ngOnChanges(changes: SimpleChanges): void {}

  ngOnInit(): void {}
}
