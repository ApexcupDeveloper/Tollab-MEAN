import { TestBed } from '@angular/core/testing';

import { CardDetailsService } from './card-details.service';

describe('CardDetailsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CardDetailsService = TestBed.get(CardDetailsService);
    expect(service).toBeTruthy();
  });
});
