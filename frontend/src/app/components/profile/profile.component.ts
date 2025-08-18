import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { environment } from 'src/environments/environment';

interface UserProfile {
  email: string;
  _id: string;
  picture?: string;
}

@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  userData: UserProfile | null = null;
  errorMessage = '';

  private authService = inject(AuthService);
  private http = inject(HttpClient);

  ngOnInit(): void {
    this.http.get<{ user: UserProfile }>(environment.apiUrl + '/api/users/profile').subscribe({
      next: (response) => {
        this.userData = response.user;
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
