import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { filterByprop } from './filter-by-model.pipe';
import { CharTruncatePipe } from './truncate-char.pipe';



@NgModule({
  declarations: [filterByprop,CharTruncatePipe],
  imports: [
    CommonModule
  ],
  exports: [ filterByprop,CharTruncatePipe ]
})
export class SharedPipesModule { }
