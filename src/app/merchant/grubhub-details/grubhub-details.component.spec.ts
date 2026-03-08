import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrubhubDetailsComponent } from './grubhub-details.component';

describe('GrubhubDetailsComponent', () => {
  let component: GrubhubDetailsComponent;
  let fixture: ComponentFixture<GrubhubDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GrubhubDetailsComponent]
    });
    fixture = TestBed.createComponent(GrubhubDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
