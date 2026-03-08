import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThanksMessageComponent } from './thanks-message.component';

describe('ThanksMessageComponent', () => {
  let component: ThanksMessageComponent;
  let fixture: ComponentFixture<ThanksMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThanksMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThanksMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
