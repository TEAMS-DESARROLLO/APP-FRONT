import { ComponentFixture, TestBed } from '@angular/core/testing';
import RolePaginationComponent from './role-pagination.component';


describe('RolPaginationComponent', () => {
  let component: RolePaginationComponent;
  let fixture: ComponentFixture<RolePaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RolePaginationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RolePaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
