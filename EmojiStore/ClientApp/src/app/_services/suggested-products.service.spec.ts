import { TestBed } from '@angular/core/testing';

import { SuggestedProductsService } from './suggested-products.service';

describe('SuggestedProductsService', () => {
  let service: SuggestedProductsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SuggestedProductsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
