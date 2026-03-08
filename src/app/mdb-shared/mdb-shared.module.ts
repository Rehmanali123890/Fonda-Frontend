import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ModalModule,
  WavesModule,
  BadgeModule, IconsModule,
  InputsModule,
  ButtonsModule,

  NavbarModule,
  
  TooltipModule,
  CheckboxModule,
  DropdownModule,
  ChartsModule,

  CollapseModule,


  PopoverModule,
  // TableModule,

} from 'angular-bootstrap-md';
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DropdownModule,

    ModalModule,
    WavesModule,

    InputsModule,
    ButtonsModule,
 
    BadgeModule,
    IconsModule,
    NavbarModule,
    TooltipModule,
    CheckboxModule,
    ChartsModule,

    CollapseModule,
 
    PopoverModule,

  ],
  exports: [
    CommonModule,
    DropdownModule,

    ModalModule,
    WavesModule,

    InputsModule,
    ButtonsModule,
 
    BadgeModule,
    IconsModule,
    NavbarModule,
    TooltipModule,
    CheckboxModule,
    ChartsModule,

    CollapseModule,
 
    PopoverModule,

  ]
})
export class MdbSharedModule { }
