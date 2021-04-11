import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProductCarouselComponent } from './user-product-carousel.component';

describe('UserProductCarouselComponent', () => {
  let component: UserProductCarouselComponent;
  let fixture: ComponentFixture<UserProductCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserProductCarouselComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProductCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
