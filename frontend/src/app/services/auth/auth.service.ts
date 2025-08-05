import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router) { }

signup(name: string, email: string, password: string, picture?: File) {
  const formData = new FormData();
  formData.append('name', name);
  formData.append('email', email);
  formData.append('password', password);
  if (picture) {
    formData.append('picture', picture);
  }

  return this.http.post(`${environment.apiUrl}/api/auth/signup`, formData);
}


signin(email: String, password: String){
  const body = {email, password};
  return this.http.post<{ token: string; user: { email: string; role: string } }>(`${environment.apiUrl}/api/auth/signin`, body
);

}

logout(){
  localStorage.removeItem('token');
  this.router.navigate(['/authentication/login']);
}

isLoggedIn(){
  return !!localStorage.getItem('token')
}

getToken(){
  return localStorage.getItem('token')
}

getProfile() {
  const headers = {
    Authorization: `Bearer ${this.getToken()}`
  };
  return this.http.get<{ user: any }>(`${environment.apiUrl}/api/profile`, { headers });
}

getRedirectPath() {
  const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
  return this.http.get<{ path: string }>(`${environment.apiUrl}/api/auth-redirect`, { headers });
}




}
