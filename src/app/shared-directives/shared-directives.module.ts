import { DebounceClickDirective } from './debounce-click.directive';
import { OnlyNumbersDirective } from './only-numbers.directive';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnDebounceDirective } from './on-debounce.directive';

@NgModule({
  declarations: [OnDebounceDirective, OnlyNumbersDirective, DebounceClickDirective,
    // HasClaimDirective, IsDevelopmentDirective, DebounceClickDirective, IsOutsideDirective
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    OnDebounceDirective,
    OnlyNumbersDirective,
    // HasClaimDirective, IsDevelopmentDirective,
    DebounceClickDirective,
    // IsOutsideDirective
  ]
})
export class SharedDirectivesModule { }
