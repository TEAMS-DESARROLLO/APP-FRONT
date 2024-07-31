import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationTrainingCoursesComponent } from './registration-training-courses.component';

describe('RegistrationTrainingCoursesComponent', () => {
  let component: RegistrationTrainingCoursesComponent;
  let fixture: ComponentFixture<RegistrationTrainingCoursesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrationTrainingCoursesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegistrationTrainingCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
