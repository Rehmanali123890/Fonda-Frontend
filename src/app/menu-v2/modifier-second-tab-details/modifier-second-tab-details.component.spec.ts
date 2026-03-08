import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierSecondTabDetailsComponent } from './modifier-second-tab-details.component';

describe('ModifierSecondTabDetailsComponent', () => {
  let component: ModifierSecondTabDetailsComponent;
  let fixture: ComponentFixture<ModifierSecondTabDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModifierSecondTabDetailsComponent]
    });
    fixture = TestBed.createComponent(ModifierSecondTabDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
