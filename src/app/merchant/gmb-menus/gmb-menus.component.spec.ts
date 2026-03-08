import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GmbMenusComponent } from './gmb-menus.component';

describe('GmbMenusComponent', () => {
  let component: GmbMenusComponent;
  let fixture: ComponentFixture<GmbMenusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GmbMenusComponent]
    });
    fixture = TestBed.createComponent(GmbMenusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
