import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantPlatformsComponent } from './merchant-platforms.component';

describe('MerchantPlatformsComponent', () => {
  let component: MerchantPlatformsComponent;
  let fixture: ComponentFixture<MerchantPlatformsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MerchantPlatformsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantPlatformsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
