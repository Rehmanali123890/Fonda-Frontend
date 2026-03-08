import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoordashDetailsComponent } from './doordash-details.component';

describe('DoordashDetailsComponent', () => {
  let component: DoordashDetailsComponent;
  let fixture: ComponentFixture<DoordashDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DoordashDetailsComponent]
    });
    fixture = TestBed.createComponent(DoordashDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
