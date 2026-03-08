import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdbSharedModule } from './../mdb-shared/mdb-shared.module';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { MyProfileRoutingModule } from './my-profile-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { TranslocoModule } from '@ngneat/transloco';
import { HttpClientModule } from '@angular/common/http';
import { MatProgressBarModule } from '@angular/material/progress-bar'


@NgModule({
  declarations: [ProfileComponent],
  imports: [
    CommonModule,
    FormsModule,
    MyProfileRoutingModule,
    MdbSharedModule,
    TranslocoModule,
    HttpClientModule,
    MDBBootstrapModule,
    MatProgressBarModule
  ],
  exports: [ProfileComponent],
})
export class MyProfileModule { }
