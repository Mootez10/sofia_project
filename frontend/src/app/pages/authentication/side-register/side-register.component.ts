import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'app-side-register',
  standalone: true,
  imports: [
    RouterModule,          // ✅ needed for [routerLink]
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './side-register.component.html',
})
export class AppSideRegisterComponent {
  options = inject(CoreService).getOptions();
  registerData = { name: '', email: '', password: '' };
  selectedFile: File | null = null;

  private router = inject(Router);
  private authService = inject(AuthService);
  private notify = inject(NotificationService);

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] || null;
  }

  onRegister() {
    if (!this.registerData.name || !this.registerData.email || !this.registerData.password || !this.selectedFile) {
      this.notify.registrationFailed('All fields are required including profile picture.');
      return;
    }

    this.authService
      .signup(
        this.registerData.name,
        this.registerData.email,
        this.registerData.password,
        this.selectedFile
      )
      .subscribe({
        next: () => {
          this.notify.registrationSuccess();
          setTimeout(() => this.router.navigate(['/authentication/login']), 1500);
        },
        error: (err) => {
          this.notify.registrationFailed(err?.error?.message);
        },
      });
  }
}
