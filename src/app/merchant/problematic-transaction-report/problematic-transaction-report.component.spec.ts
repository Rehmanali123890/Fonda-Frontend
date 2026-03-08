import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProblematicTransactionReportComponent } from './problematic-transaction-report.component';

describe('ProblematicTransactionReportComponent', () => {
  let component: ProblematicTransactionReportComponent;
  let fixture: ComponentFixture<ProblematicTransactionReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProblematicTransactionReportComponent]
    });
    fixture = TestBed.createComponent(ProblematicTransactionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
