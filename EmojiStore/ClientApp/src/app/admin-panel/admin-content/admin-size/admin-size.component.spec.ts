import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSizeComponent } from './admin-size.component';

describe('AdminSizeComponent', () => {
  let component: AdminSizeComponent;
  let fixture: ComponentFixture<AdminSizeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminSizeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
