import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserBordComponent } from './user-bord.component';

describe('UserBordComponent', () => {
  let component: UserBordComponent;
  let fixture: ComponentFixture<UserBordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserBordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserBordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
