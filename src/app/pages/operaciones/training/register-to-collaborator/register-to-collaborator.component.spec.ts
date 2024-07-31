import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterToCollaboratorComponent } from './register-to-collaborator.component';

describe('RegisterToCollaboratorComponent', () => {
  let component: RegisterToCollaboratorComponent;
  let fixture: ComponentFixture<RegisterToCollaboratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterToCollaboratorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegisterToCollaboratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
