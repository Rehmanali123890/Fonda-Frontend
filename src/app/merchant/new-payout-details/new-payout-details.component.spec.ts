import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPayoutDetailsComponent } from './new-payout-details.component';

describe('NewPayoutDetailsComponent', () => {
  let component: NewPayoutDetailsComponent;
  let fixture: ComponentFixture<NewPayoutDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewPayoutDetailsComponent]
    });
    fixture = TestBed.createComponent(NewPayoutDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
