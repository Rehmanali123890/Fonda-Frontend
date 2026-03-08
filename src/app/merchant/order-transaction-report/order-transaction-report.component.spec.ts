import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderTransactionReportComponent } from './order-transaction-report.component';

describe('OrderTransactionReportComponent', () => {
  let component: OrderTransactionReportComponent;
  let fixture: ComponentFixture<OrderTransactionReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderTransactionReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderTransactionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
