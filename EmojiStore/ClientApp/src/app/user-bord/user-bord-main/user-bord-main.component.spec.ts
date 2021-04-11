import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserBordMainComponent } from './user-bord-main.component';

describe('UserBordMainComponent', () => {
  let component: UserBordMainComponent;
  let fixture: ComponentFixture<UserBordMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserBordMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserBordMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
