import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MenuV2RoutingModule } from './menu-v2-routing.module';
import { MenusSideNavComponent } from './menus-side-nav/menus-side-nav.component';
import { MenuComponent } from './menu/menu.component';
import { CategoriesComponent } from './categories/categories.component';
import { ItemsComponent } from './items/items.component';
import { ModifiersComponent } from './modifiers/modifiers.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { MenuDetailsComponent } from './menu-details/menu-details.component';
import { MenuTemplatesComponent } from './menu-templates/menu-templates.component';
import { SharedDirectivesModule } from './../shared-directives/shared-directives.module';
import { SharedPipesModule } from './../shared-pipes/shared-pipes.module';
import { FormsModule } from '@angular/forms';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { MdbSharedModule } from './../mdb-shared/mdb-shared.module';
import { WavesModule, ButtonsModule } from 'angular-bootstrap-md';
import { NgSelectModule } from '@ng-select/ng-select';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TranslocoModule } from '@ngneat/transloco';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { CategoryDetailsComponent } from './category-details/category-details.component';
import { ItemDetailsComponent } from './item-details/item-details.component';
import { MenuTemplateDetailsComponent } from './menu-template-details/menu-template-details.component';
import { ModifiersDetailsComponent } from './modifiers-details/modifiers-details.component';
import { ModifierSecondTabDetailsComponent } from './modifier-second-tab-details/modifier-second-tab-details.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { PreventNegativeDirective } from 'src/app/core/prevent-negative.directive';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';



@NgModule({
  declarations: [
    MenusSideNavComponent,
    MenuComponent,
    CategoriesComponent,
    ItemsComponent,
    ModifiersComponent,
    MainLayoutComponent,
    MenuDetailsComponent,
    MenuTemplatesComponent,
    CategoryDetailsComponent,
    ItemDetailsComponent,
    MenuTemplateDetailsComponent,
    ModifiersDetailsComponent,
    ModifierSecondTabDetailsComponent,
    PreventNegativeDirective
  ],
  imports: [
    CommonModule,
    MenuV2RoutingModule,
    MdbSharedModule,
    CommonModule,
    FormsModule,
    ToastrModule,
    SharedPipesModule,
    SharedDirectivesModule,
    MDBBootstrapModule,
    MdbSharedModule,
    WavesModule,
    ButtonsModule,
    DragDropModule,
    NgSelectModule,
    TranslocoModule,
    HttpClientModule,
    NgbDropdownModule,
    MatCardModule,
    MatButtonModule,
    NgxMaskDirective, 
    NgMultiSelectDropDownModule.forRoot(),

  ],
  providers: [
    provideNgxMask(), // Provide configuration for ngx-mask
  ],
})
export class MenuV2Module { }
