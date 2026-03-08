import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuHoursComponent } from './menu-hours.component';

describe('MenuHoursComponent', () => {
  let component: MenuHoursComponent;
  let fixture: ComponentFixture<MenuHoursComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuHoursComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuHoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
