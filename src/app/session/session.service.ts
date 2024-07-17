import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor() { }

  saveToken(token: string): void {
    sessionStorage.setItem('auth_token', token);
    this.displayToken(token);
  }

  displayToken(token: string): void {
    console.log('Token:', token);
    // You can modify this method to display the token in your UI if needed.
    // For security reasons, avoid displaying sensitive information in the UI.
  }

  getToken(): string | null {
    return sessionStorage.getItem('auth_token');
  }

  logout(): void {
    sessionStorage.removeItem('auth_token');
  }
}
