import { Injectable, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

type SnackType = 'success' | 'error' | 'info' | 'warning';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private snack = inject(MatSnackBar);

  private open(message: string, type: SnackType = 'info', config?: MatSnackBarConfig) {
    const base: MatSnackBarConfig = {
      duration: 3000,
      horizontalPosition: 'center' as MatSnackBarHorizontalPosition,
      verticalPosition: 'bottom' as MatSnackBarVerticalPosition,
      panelClass: [`snackbar--${type}`],
    };
    this.snack.open(message, '', { ...base, ...(config || {}) });
  }

  // Generic helpers
  success(message: string, config?: MatSnackBarConfig) { this.open(message, 'success', config); }
  error(message: string, config?: MatSnackBarConfig)   { this.open(message, 'error', config); }
  info(message: string, config?: MatSnackBarConfig)    { this.open(message, 'info', config); }
  warning(message: string, config?: MatSnackBarConfig) { this.open(message, 'warning', config); }

  // Auth presets
  registrationSuccess() {
    this.success('Registration successful! Please login.');
  }

  registrationFailed(message?: string) {
    this.error(message || 'Sign up failed. Please try again.');
  }

  loginSuccess() {
    this.success('Logged in successfully. Welcome back!');
  }

  loginFailed(message?: string) {
    this.error(message || 'Login failed. Check your credentials and try again.');
  }

  logoutSuccess() {
    this.info('You have been logged out.');
  }
}
