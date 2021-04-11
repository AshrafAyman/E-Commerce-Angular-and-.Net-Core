import { TestBed } from '@angular/core/testing';

import { CartbadgeService } from './cartbadge.service';

describe('CartbadgeService', () => {
  let service: CartbadgeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartbadgeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
