import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StorefrontDetailsComponent } from './storefront-details.component';

describe('StorefrontDetailsComponent', () => {
  let component: StorefrontDetailsComponent;
  let fixture: ComponentFixture<StorefrontDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StorefrontDetailsComponent]
    });
    fixture = TestBed.createComponent(StorefrontDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
