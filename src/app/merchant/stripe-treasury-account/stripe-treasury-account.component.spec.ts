import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StripeTreasuryAccountComponent } from './stripe-treasury-account.component';

describe('StripeTreasuryAccountComponent', () => {
  let component: StripeTreasuryAccountComponent;
  let fixture: ComponentFixture<StripeTreasuryAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StripeTreasuryAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StripeTreasuryAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
