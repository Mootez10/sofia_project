import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { NotificationService } from 'src/app/services/notification/notification.service';

@Component({
  selector: 'app-side-login',
  standalone: true,
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './side-login.component.html',
})
export class AppSideLoginComponent {
  loginData = { email: '', password: '' };

  constructor(
    private router: Router,
    private authService: AuthService,
    private notify: NotificationService
  ) {}

  onLogin() {
    const { email, password } = this.loginData;

    if (!email || !password) {
      this.notify.loginFailed('Email and password are required.');
      return;
    }

    this.authService.signin(email, password).subscribe({
      next: (response) => {
        // Save token (your AuthService doesn't store it automatically)
        localStorage.setItem('token', response.token);

        // Optional: show success before redirect
        this.notify.loginSuccess();

        // Ask API for where to go next, fallback to /profile
        this.authService.getRedirectPath().subscribe({
          next: (res) => {
            setTimeout(() => this.router.navigate([res.path]), 1200);
          },
          error: () => {
            setTimeout(() => this.router.navigate(['/profile']), 1200);
          },
        });
      },
      error: (err) => {
        this.notify.loginFailed(err?.error?.message || 'Login failed. Please try again.');
      },
    });
  }
}
