import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropDownSharedMultipleComponent } from './drop-down-shared-multiple.component';

describe('DropDownSharedMultipleComponent', () => {
  let component: DropDownSharedMultipleComponent;
  let fixture: ComponentFixture<DropDownSharedMultipleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropDownSharedMultipleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DropDownSharedMultipleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
