import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProductMainComponent } from './user-product-main.component';

describe('UserProductMainComponent', () => {
  let component: UserProductMainComponent;
  let fixture: ComponentFixture<UserProductMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserProductMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProductMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
