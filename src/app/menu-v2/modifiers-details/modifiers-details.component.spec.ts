import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifiersDetailsComponent } from './modifiers-details.component';

describe('ModifiersDetailsComponent', () => {
  let component: ModifiersDetailsComponent;
  let fixture: ComponentFixture<ModifiersDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModifiersDetailsComponent]
    });
    fixture = TestBed.createComponent(ModifiersDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
