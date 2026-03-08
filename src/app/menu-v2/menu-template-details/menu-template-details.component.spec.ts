import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuTemplateDetailsComponent } from './menu-template-details.component';

describe('MenuTemplateDetailsComponent', () => {
  let component: MenuTemplateDetailsComponent;
  let fixture: ComponentFixture<MenuTemplateDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MenuTemplateDetailsComponent]
    });
    fixture = TestBed.createComponent(MenuTemplateDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
