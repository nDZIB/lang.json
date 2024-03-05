import { TestBed } from '@angular/core/testing';

import { LnjtranslateService } from './lnjtranslate.service';

describe('LnjtranslateService', () => {
  let service: LnjtranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LnjtranslateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
