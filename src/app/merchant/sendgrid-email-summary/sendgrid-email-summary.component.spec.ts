import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendgridEmailSummaryComponent } from './sendgrid-email-summary.component';

describe('PayoutComponent', () => {
  let component: SendgridEmailSummaryComponent;
  let fixture: ComponentFixture<SendgridEmailSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SendgridEmailSummaryComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendgridEmailSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
