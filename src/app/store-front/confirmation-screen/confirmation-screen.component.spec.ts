import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationScreenComponent } from './confirmation-screen.component';

describe('ConfirmationScreenComponent', () => {
  let component: ConfirmationScreenComponent;
  let fixture: ComponentFixture<ConfirmationScreenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmationScreenComponent]
    });
    fixture = TestBed.createComponent(ConfirmationScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
