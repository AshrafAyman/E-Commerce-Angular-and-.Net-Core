import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminWashingComponent } from './admin-washing.component';

describe('AdminWashingComponent', () => {
  let component: AdminWashingComponent;
  let fixture: ComponentFixture<AdminWashingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminWashingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminWashingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
