import { SharedDirectivesModule } from './../shared-directives/shared-directives.module';
import { SharedPipesModule } from './../shared-pipes/shared-pipes.module';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { ProductsRoutingModule } from './products-routing.module';
import { ProductssListComponent } from './productss-list/productss-list.component';
import { MdbSharedModule } from './../mdb-shared/mdb-shared.module';
import { WavesModule, ButtonsModule } from 'angular-bootstrap-md';
import { MenuHoursComponent } from './menu-hours/menu-hours.component';
import { MenuTemplateComponent } from './menu-template/MenuTemplateComponent';
import { NgSelectModule } from '@ng-select/ng-select';
import { RearrangeComponent } from './rearrange/rearrange.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TranslocoModule } from '@ngneat/transloco';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';


@NgModule({
  declarations: [ProductssListComponent, MenuHoursComponent, MenuTemplateComponent, RearrangeComponent],
  imports: [
    CommonModule,
    FormsModule,
    ProductsRoutingModule,
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
    MDBBootstrapModule.forRoot()

  ]
})
export class ProductsModule { }
