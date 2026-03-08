import { NgModule, isDevMode } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
// import {  } from 'ngx-chartjs';
import { GlobalSnackBarComponent } from './global-snack-bar/global-snack-bar.component';
import { GlobalModalsComponent } from './global-modals/global-modals.component';
import { MdbAccordionModule } from 'mdb-angular-ui-kit/accordion';
import { ServiceWorkerModule } from '@angular/service-worker';
import { MDBBootstrapModule, WavesModule } from 'angular-bootstrap-md';
import { ToastrModule } from 'ngx-toastr';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { SSOInterceptor } from './core/SSO.interceptor';
import { ApiInterceptor } from './core/ApiInterceptor';
import { environment } from 'src/environments/environment';
// import { httpLoader } from './transloco-loader';
import { HttpClientModule } from '@angular/common/http';
import { TRANSLOCO_CONFIG, TranslocoModule } from '@ngneat/transloco';
import { MatProgressBarModule } from '@angular/material/progress-bar'
import {
  provideTransloco,
} from '@ngneat/transloco';
import { TranslocoHttpLoader } from './transloco-loader';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MdbTabsModule } from 'mdb-angular-ui-kit/tabs';
import { AuthModule } from '@auth0/auth0-angular';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { PlotlyModule } from 'angular-plotly.js';
import * as PlotlyJS from 'plotly.js-dist-min';
import { BankReconciliationComponent } from './bank-reconciliation/bank-reconciliation.component';

PlotlyModule.plotlyjs = PlotlyJS;

@NgModule({
  declarations: [
    AppComponent,
    GlobalModalsComponent,
    GlobalSnackBarComponent,
    BankReconciliationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MdbAccordionModule,
    FormsModule,
    PlotlyModule,
    MatProgressBarModule,
    WavesModule,
    ReactiveFormsModule,
    MDBBootstrapModule.forRoot(),
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    TranslocoModule,
    HttpClientModule,
    MdbTabsModule,
    CarouselModule,  // Add Owl Carousel module here
    AuthModule.forRoot({
      domain: environment.SSODomain,  // e.g., dev-abc123.us.auth0.com
      clientId: environment.SSOClientId,
      cacheLocation: 'localstorage', // Optional: to persist tokens across refreshes
      useRefreshTokens: false,     // from the Auth0 application settings
      authorizationParams: {
        redirect_uri: `${environment.SSORedirectUri}accounts/login?fromAuth0=true`,
        audience: `https://${environment.SSODomain}/api/v2/`,
        scope: 'read:users read:current_user openid email profile',
        prompt: 'consent' // This is where the app will be redirected after login
      }
    }),
    // AuthModule.forRoot({
    //   domain: 'dev-zae7qgvn32xmyu3g.us.auth0.com',  // e.g., dev-abc123.us.auth0.com
    //   clientId: 'Ou5Hyony3mmWPY4GCLn3VxY8mLH9H1jA',
    //   cacheLocation: 'localstorage', // Optional: to persist tokens across refreshes
    //   useRefreshTokens: false,     // from the Auth0 application settings
    //   authorizationParams: {
    //     redirect_uri: 'http://localhost:4200/accounts/login?fromAuth0=true',
    //     audience: 'https://dev-zae7qgvn32xmyu3g.us.auth0.com/api/v2/',
    //     scope: 'read:users read:current_user openid email profile',
    //     prompt: 'consent' // This is where the app will be redirected after login
    //   }
    // }),


  ],
  exports: [TranslocoModule],
  providers: [
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },  // Provide JWT_OPTIONS
    JwtHelperService,
    { provide: HTTP_INTERCEPTORS, useClass: SSOInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true },
    provideTransloco({
      config: {
        availableLangs: ['en', 'es'],
        defaultLang: 'en',
        // Remove this option if your application doesn't support changing language in runtime.
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader
    })
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
