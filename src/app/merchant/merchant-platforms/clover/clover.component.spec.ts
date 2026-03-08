import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CloverComponent } from './clover.component';

describe('CloverComponent', () => {
  let component: CloverComponent;
  let fixture: ComponentFixture<CloverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CloverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CloverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
