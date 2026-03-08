import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstimatePayoutDetailsComponent } from './estimate-payout-details.component';

describe('EstimatePayoutDetailsComponent', () => {
  let component: EstimatePayoutDetailsComponent;
  let fixture: ComponentFixture<EstimatePayoutDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EstimatePayoutDetailsComponent]
    });
    fixture = TestBed.createComponent(EstimatePayoutDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
