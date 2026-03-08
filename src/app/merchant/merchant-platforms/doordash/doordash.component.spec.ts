import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoordashComponent } from './doordash.component';

describe('UbereatsComponent', () => {
  let component: DoordashComponent;
  let fixture: ComponentFixture<DoordashComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DoordashComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoordashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
