import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPayoutComponent } from './new-payout.component';

describe('NewPayoutComponent', () => {
  let component: NewPayoutComponent;
  let fixture: ComponentFixture<NewPayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NewPayoutComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
