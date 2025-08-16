import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-side-login',
  standalone: true,
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule],
  templateUrl: './side-login.component.html',
})
export class AppSideLoginComponent {
  loginData = { email: '', password: '' };

  constructor(
    private router: Router,
    private authService: AuthService,
    private notify: NotificationService,
    private translate: TranslateService   // ⬅️ inject to translate TS strings
  ) {}

  onLogin() {
    const { email, password } = this.loginData;

    if (!email || !password) {
      this.notify.loginFailed(this.translate.instant('auth.errors.requiredEmailPassword'));
      return;
    }

    this.authService.signin(email, password).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        this.notify.success(this.translate.instant('auth.loginSuccess'));

        this.authService.getRedirectPath().subscribe({
          next: (res) => setTimeout(() => this.router.navigate([res.path]), 1200),
          error: () => setTimeout(() => this.router.navigate(['/profile']), 1200),
        });
      },
      error: (err) => {
        this.notify.loginFailed(
          err?.error?.message || this.translate.instant('auth.errors.loginFailed')
        );
      },
    });
  }
}
