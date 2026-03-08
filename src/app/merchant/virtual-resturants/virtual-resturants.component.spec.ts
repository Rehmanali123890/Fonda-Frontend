import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VirtualResturantsComponent } from './virtual-resturants.component';

describe('VirtualResturantsComponent', () => {
  let component: VirtualResturantsComponent;
  let fixture: ComponentFixture<VirtualResturantsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VirtualResturantsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VirtualResturantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
