import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UbereatsDetailsComponent } from './ubereats-details.component';

describe('UbereatsDetailsComponent', () => {
  let component: UbereatsDetailsComponent;
  let fixture: ComponentFixture<UbereatsDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UbereatsDetailsComponent]
    });
    fixture = TestBed.createComponent(UbereatsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
