import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WoflowComponent } from './woflow.component';

describe('WoflowComponent', () => {
  let component: WoflowComponent;
  let fixture: ComponentFixture<WoflowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WoflowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WoflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
