import { FormsModule } from '@angular/forms';
import { NgModule, isDevMode } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { SidenavModule, WavesModule, AccordionModule, NavbarModule, PreloadersModule } from 'angular-bootstrap-md'
// import { DataTablesModule } from 'angular-datatables';
import { PublicRoutingModule } from './public-routing.module';
import { SidenavComponent } from './sidenav/sidenav.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { MDBBootstrapModule, WavesModule } from 'angular-bootstrap-md';
import { ToastrModule } from 'ngx-toastr';
import { MdbAccordionModule } from 'mdb-angular-ui-kit/accordion';

// import { IconsModule } from 'ng-uikit-pro-standard';
import { DashboardComponent } from './dashboard/dashboard.component'
// import { ChartsModule, ChartSimpleModule } from 'ng-uikit-pro-standard';
import { ErrorComponent } from './error/error.component'
import { NgSelectModule } from '@ng-select/ng-select';
import { MdbSharedModule } from '../mdb-shared/mdb-shared.module';
import { TranslocoModule } from '@ngneat/transloco';
import { HttpClientModule } from '@angular/common/http';
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { DataTablesModule } from "angular-datatables";



@NgModule({
  declarations: [SidenavComponent, MainLayoutComponent, DashboardComponent, ErrorComponent],
  imports: [
    CommonModule,
    PublicRoutingModule,
    // SidenavModule,
    NgSelectModule,
    MdbAccordionModule,
    DataTablesModule,
    ToastrModule,
    MatProgressBarModule,
    // WavesModule,
    // AccordionModule,
    MDBBootstrapModule,
    // NavbarModule,
    FormsModule,
    // ChartsModule,
    // ChartModule,
    WavesModule,
    // IconsModule,
    // ChartsModule,
    // PreloadersModule,
    // ChartSimpleModule,
    MdbSharedModule,
    TranslocoModule,
    HttpClientModule,
    MDBBootstrapModule.forRoot()


  ],
  providers: []
})
export class PublicModule { }
