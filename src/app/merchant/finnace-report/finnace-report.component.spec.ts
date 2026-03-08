import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinnaceReportComponent } from './finnace-report.component';

describe('FinnaceReportComponent', () => {
  let component: FinnaceReportComponent;
  let fixture: ComponentFixture<FinnaceReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinnaceReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinnaceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
