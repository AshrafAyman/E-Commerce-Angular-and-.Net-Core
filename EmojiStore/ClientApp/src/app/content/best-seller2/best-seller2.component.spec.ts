import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BestSeller2Component } from './best-seller2.component';

describe('BestSeller2Component', () => {
  let component: BestSeller2Component;
  let fixture: ComponentFixture<BestSeller2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BestSeller2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BestSeller2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
