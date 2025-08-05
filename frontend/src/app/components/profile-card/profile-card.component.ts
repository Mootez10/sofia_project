import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { AuthService } from 'src/app/services/auth/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profile-card',
  imports: [MaterialModule, TablerIconsModule, CommonModule],
  templateUrl: './profile-card.component.html',
})
export class AppProfileCardComponent implements OnInit{

  userData: any = null;
  errorMessage = '';



  constructor(private authService: AuthService, private http: HttpClient) { }

  ngOnInit(): void {
      this.http.get(environment.apiUrl+'/api/profile').subscribe({
        next:(response: any)=>{
          this.userData = response;
        },
        error:(err: any)=>{
          console.log('Failed to fetch profile', err);
          this.errorMessage = 'Could not load profile data.'
        },
      });
  }

  onLogout(){
    this.authService.logout();
  }
}
