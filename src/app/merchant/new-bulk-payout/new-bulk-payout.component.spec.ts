import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewBulkPayoutComponent } from './new-bulk-payout.component';

describe('NewBulkPayoutComponent', () => {
  let component: NewBulkPayoutComponent;
  let fixture: ComponentFixture<NewBulkPayoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewBulkPayoutComponent]
    });
    fixture = TestBed.createComponent(NewBulkPayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
