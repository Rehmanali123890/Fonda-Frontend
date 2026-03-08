import { Injectable } from '@angular/core';
import { Auth0Client } from '@auth0/auth0-spa-js'; // Import Auth0 client

@Injectable({
  providedIn: 'root'
})
export class AuthServiceSSO {
  private auth0Client: Auth0Client;

  constructor() {
    this.auth0Client = new Auth0Client({
      domain: 'dev-zae7qgvn32xmyu3g.us.auth0.com',  // e.g., dev-abc123.us.auth0.com
      clientId: 'sxr9jVmQBT8Qu6pHEqfaH4hUS76BpL9V',   // from the Auth0 application settings
      authorizationParams: {
        redirect_uri: 'http://localhost:4200/home/dashboard' // This is where the app will be redirected after login
      }
    });
  }

  async isAuthenticated(): Promise<boolean> {
    return await this.auth0Client.isAuthenticated();
  }

  async getUser(): Promise<any> {
    try {
      const isAuthenticated = await this.isAuthenticated();

      // Ensure the user is authenticated before trying to get user information
      if (isAuthenticated) {
        const user = await this.auth0Client.getUser();
        return user;
      } else {
        console.error('User not authenticated');
        return null;
      }
    } catch (error) {
      console.error('Error getting user', error);
      return null;
    }
  }

  async getTokenSilently(): Promise<any> {
    try {
      const token = await this.auth0Client.getTokenSilently();
      return token;
    } catch (error) {
      console.error('Error getting token', error);
      return null;
    }
  }

  // logout(): void {
  //   this.auth0Client.logout({
  //     returnTo: window.location.origin // Redirect after logout
  //   });
  // }
}
