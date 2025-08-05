import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit{
    userData: any = null;
    errorMessage = '';
  
  
  
    constructor(private authService: AuthService, private http: HttpClient) { }
  
    ngOnInit(): void {
        this.http.get(environment.apiUrl+'/api/users/profile').subscribe({
          next:(response: any)=>{
            console.log('Profile response:', response);
            this.userData = response.user;
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
