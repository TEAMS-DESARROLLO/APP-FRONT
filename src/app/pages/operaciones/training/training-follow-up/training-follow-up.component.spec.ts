import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingFollowUpComponent } from './training-follow-up.component';

describe('TrainingFollowUpComponent', () => {
  let component: TrainingFollowUpComponent;
  let fixture: ComponentFixture<TrainingFollowUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainingFollowUpComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TrainingFollowUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
