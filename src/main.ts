import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

// import { bootstrapApplication } from '@angular/platform-browser';
// import { provideAuth0 } from '@auth0/auth0-angular';
// import { AppComponent } from 'src/app/app.component';

// bootstrapApplication(AppComponent, {
//   providers: [
//     provideAuth0({
//       domain: 'dev-zae7qgvn32xmyu3g.us.auth0.com',
//       clientId: 'sxr9jVmQBT8Qu6pHEqfaH4hUS76BpL9V',
//       authorizationParams: {
//         redirect_uri: 'http://localhost:4200/home/dashboard'
//       }
//     }),
//   ]
// });
if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
