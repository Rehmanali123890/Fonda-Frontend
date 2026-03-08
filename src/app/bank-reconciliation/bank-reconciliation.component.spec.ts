import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankReconciliationComponent } from './bank-reconciliation.component';

describe('BankReconciliationComponent', () => {
  let component: BankReconciliationComponent;
  let fixture: ComponentFixture<BankReconciliationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BankReconciliationComponent]
    });
    fixture = TestBed.createComponent(BankReconciliationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
