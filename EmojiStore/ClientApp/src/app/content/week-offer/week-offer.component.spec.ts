import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeekOfferComponent } from './week-offer.component';

describe('WeekOfferComponent', () => {
  let component: WeekOfferComponent;
  let fixture: ComponentFixture<WeekOfferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeekOfferComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeekOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
