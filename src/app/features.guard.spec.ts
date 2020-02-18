import { TestBed, async, inject } from '@angular/core/testing';

import { FeaturesGuard } from './features.guard';

describe('FeaturesGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FeaturesGuard]
    });
  });

  it('should ...', inject([FeaturesGuard], (guard: FeaturesGuard) => {
    expect(guard).toBeTruthy();
  }));
});
