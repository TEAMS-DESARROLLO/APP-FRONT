import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterPaginationComponent } from './register-pagination.component';

describe('RegisterPaginationComponent', () => {
  let component: RegisterPaginationComponent;
  let fixture: ComponentFixture<RegisterPaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterPaginationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegisterPaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
