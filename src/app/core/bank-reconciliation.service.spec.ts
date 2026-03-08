import { TestBed } from '@angular/core/testing';

import { BankReconciliationService } from './bank-reconciliation.service';

describe('BankReconciliationService', () => {
  let service: BankReconciliationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BankReconciliationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
