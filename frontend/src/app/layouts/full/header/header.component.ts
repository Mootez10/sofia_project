import {
  Component,
  Output,
  EventEmitter,
  Input,
  ViewEncapsulation,
  OnInit,
} from '@angular/core';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { BrandingComponent } from '../sidebar/branding.component';
import { AuthService } from 'src/app/services/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  imports: [
    RouterModule,
    CommonModule,
    NgScrollbarModule,
    TablerIconsModule,
    MaterialModule,
    BrandingComponent
  ],
  templateUrl: './header.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent implements OnInit {
  @Input() userData: any;
  @Input() showToggle = true;
  @Input() toggleChecked = false;
  @Output() toggleMobileNav = new EventEmitter<void>();

  environmentUrl = environment.apiUrl;

  constructor(private authService: AuthService, private http: HttpClient) {}

  ngOnInit() {
  this.http.get(environment.apiUrl + '/api/users/profile').subscribe({
    next: (res: any) => {
      this.userData = res.user;
      console.log('User data loaded in header:', this.userData);
    },
    error: () => {
      console.error('Failed to load user data');
    }
  });
}

  get profileImage(): string {
  return this.userData?.picture
    ? `${environment.apiUrl}${this.userData.picture}`
    : '/assets/images/profile/default-avatar.jpg';
}




  onLogout() {
    this.authService.logout();
  }

}

