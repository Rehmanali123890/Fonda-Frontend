import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UbereatsComponent } from './ubereats.component';

describe('UbereatsComponent', () => {
  let component: UbereatsComponent;
  let fixture: ComponentFixture<UbereatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbereatsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbereatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
