import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantPayoutDetailsComponent } from './merchant-payout-details.component';

describe('MerchantPayoutDetailsComponent', () => {
  let component: MerchantPayoutDetailsComponent;
  let fixture: ComponentFixture<MerchantPayoutDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MerchantPayoutDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantPayoutDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
