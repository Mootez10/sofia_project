import { Injectable, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MESSAGES } from 'src/constants/messages';

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
    this.success(MESSAGES.REGISTRATION_SUCCESS);
  }

  registrationFailed(message?: string) {
    this.error(message || MESSAGES.REGISTRATION_FAILED);
  }

  loginSuccess() {
    this.success(MESSAGES.LOGIN_SUCCESS);
  }

  loginFailed(message?: string) {
    this.error(message || MESSAGES.LOGIN_FAILED);
  }

  logoutSuccess() {
    this.info(MESSAGES.LOGOUT_SUCCESS);
  }
}
