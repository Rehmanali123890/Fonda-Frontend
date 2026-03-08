import { SharedDirectivesModule } from './../shared-directives/shared-directives.module';
import { MdbSharedModule } from './../mdb-shared/mdb-shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { UserRoutingModule } from './user-routing.module';
import { FormsModule } from '@angular/forms';
import { UsersListComponent } from './users-list/users-list.component';
// import { WavesModule, TableModule, IconsModule } from 'ng-uikit-pro-standard';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
// import { MyProfileModule } from "../my-profile/my-profile.module";
import { TranslocoModule } from '@ngneat/transloco';
import { HttpClientModule } from '@angular/common/http';
import {MatProgressBarModule} from '@angular/material/progress-bar'

@NgModule({
  declarations: [UsersListComponent],
  imports: [
    FormsModule,
    MdbSharedModule,
    SharedDirectivesModule,
    CommonModule,
    UserRoutingModule,
    MDBBootstrapModule,
    MatProgressBarModule,
    // TableModule,
    // WavesModule,
    // IconsModule,
    InfiniteScrollModule,
    // MyProfileModule,
    TranslocoModule,
    HttpClientModule
  ]
})
export class UserModule { }
