import { TestBed, async, inject } from '@angular/core/testing';

import { SelectLanguageGuard } from './select-language.guard';

describe('SelectLanguageGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SelectLanguageGuard]
    });
  });

  it('should ...', inject([SelectLanguageGuard], (guard: SelectLanguageGuard) => {
    expect(guard).toBeTruthy();
  }));
});
