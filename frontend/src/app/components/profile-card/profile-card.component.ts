import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { AuthService } from 'src/app/services/auth/auth.service';
import { environment } from 'src/environments/environment';

interface UserProfile {
  user?: {
    email: string;
    _id: string;
    picture?: string;
  };
}

@Component({
  selector: 'app-profile-card',
  imports: [MaterialModule, TablerIconsModule, CommonModule],
  templateUrl: './profile-card.component.html',
})
export class AppProfileCardComponent implements OnInit {
  userData: UserProfile | null = null;
  errorMessage = '';

  private authService = inject(AuthService);
  private http = inject(HttpClient);

  ngOnInit(): void {
    this.http.get<UserProfile>(environment.apiUrl + '/api/profile').subscribe({
      next: (response) => {
        this.userData = response;
      },
      error: (err: unknown) => {
        console.log('Failed to fetch profile', err);
        this.errorMessage = 'Could not load profile data.';
      },
    });
  }

  onLogout() {
    this.authService.logout();
  }
}
