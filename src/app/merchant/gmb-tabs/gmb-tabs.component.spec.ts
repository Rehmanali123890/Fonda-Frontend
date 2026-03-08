import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GmbTabsComponent } from './gmb-tabs.component';

describe('GmbTabsComponent', () => {
  let component: GmbTabsComponent;
  let fixture: ComponentFixture<GmbTabsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GmbTabsComponent]
    });
    fixture = TestBed.createComponent(GmbTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
