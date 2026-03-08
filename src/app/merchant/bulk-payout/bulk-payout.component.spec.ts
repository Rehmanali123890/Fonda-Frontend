import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkPayoutComponent } from './bulk-payout.component';

describe('BulkPayoutComponent', () => {
  let component: BulkPayoutComponent;
  let fixture: ComponentFixture<BulkPayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkPayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkPayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
