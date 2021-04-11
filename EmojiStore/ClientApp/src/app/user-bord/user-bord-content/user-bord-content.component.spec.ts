import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserBordContentComponent } from './user-bord-content.component';

describe('UserBordContentComponent', () => {
  let component: UserBordContentComponent;
  let fixture: ComponentFixture<UserBordContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserBordContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserBordContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
