import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private jwtHelper = new JwtHelperService();

  signup(name: string, email: string, password: string, picture?: File) {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('role', 'user');
    if (picture) {
      formData.append('picture', picture);
    }

    return this.http.post(`${environment.apiUrl}/api/auth/signup`, formData);
  }

  signin(email: string, password: string) {
    return this.http.post<{ token: string }>(
      `${environment.apiUrl}/api/auth/signin`,
      { email, password }
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/authentication/login']);
  }

  isLoggedIn() {
    return !!localStorage.getItem('token');
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getProfile() {
    const headers = {
      Authorization: `Bearer ${this.getToken()}`,
    };
    return this.http.get<{
      user: { email: string; _id: string; picture?: string };
    }>(`${environment.apiUrl}/api/profile`, {
      headers,
    });
  }

  getRedirectPath() {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    };
    return this.http.get<{ path: string }>(
      `${environment.apiUrl}/api/auth-redirect`,
      { headers }
    );
  }

  getCurrentUserFromToken() {
    const token = this.getToken();
    if (!token || this.jwtHelper.isTokenExpired(token)) {
      return null;
    }
    const decodedToken = this.jwtHelper.decodeToken(token);

    return decodedToken;
  }
}
