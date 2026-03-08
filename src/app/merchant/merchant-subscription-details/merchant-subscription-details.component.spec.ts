import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantSubscriptionDetailsComponent } from './merchant-subscription-details.component';

describe('MerchantSubscriptionDetailsComponent', () => {
  let component: MerchantSubscriptionDetailsComponent;
  let fixture: ComponentFixture<MerchantSubscriptionDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MerchantSubscriptionDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantSubscriptionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
