import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodOrderingComponent } from './food-ordering.component';

describe('FoodOrderingComponent', () => {
  let component: FoodOrderingComponent;
  let fixture: ComponentFixture<FoodOrderingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FoodOrderingComponent]
    });
    fixture = TestBed.createComponent(FoodOrderingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
