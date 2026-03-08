import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantOnBoardingComponent } from './merchant-on-boarding.component';

describe('MerchantOnBoardingComponent', () => {
  let component: MerchantOnBoardingComponent;
  let fixture: ComponentFixture<MerchantOnBoardingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MerchantOnBoardingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantOnBoardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
