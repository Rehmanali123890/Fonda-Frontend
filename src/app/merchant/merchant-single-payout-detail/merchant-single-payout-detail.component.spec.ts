import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantSinglePayoutDetailComponent } from './merchant-single-payout-detail.component';

describe('MerchantSinglePayoutDetailComponent', () => {
  let component: MerchantSinglePayoutDetailComponent;
  let fixture: ComponentFixture<MerchantSinglePayoutDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MerchantSinglePayoutDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantSinglePayoutDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
