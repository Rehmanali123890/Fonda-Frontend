import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenusSideNavComponent } from './menus-side-nav.component';

describe('MenusSideNavComponent', () => {
  let component: MenusSideNavComponent;
  let fixture: ComponentFixture<MenusSideNavComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MenusSideNavComponent]
    });
    fixture = TestBed.createComponent(MenusSideNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
