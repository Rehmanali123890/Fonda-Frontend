import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSinglePayoutDetailsComponent } from './new-single-payout-details.component';

describe('NewSinglePayoutDetailsComponent', () => {
  let component: NewSinglePayoutDetailsComponent;
  let fixture: ComponentFixture<NewSinglePayoutDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewSinglePayoutDetailsComponent]
    });
    fixture = TestBed.createComponent(NewSinglePayoutDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
