import { Component } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotificationService } from 'src/app/services/notification/notification.service';

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
  options = this.settings.getOptions();
  registerData = { name: '', email: '', password: '' };
  selectedFile: File | null = null;

  constructor(
    private settings: CoreService,
    private router: Router,
    private authService: AuthService,
    private notify: NotificationService
  ) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
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
