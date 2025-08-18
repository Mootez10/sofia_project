import {
  Component,
  Output,
  EventEmitter,
  Input,
  ViewEncapsulation,
  OnInit,
  inject
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
import { I18nService } from 'src/app/services/i18n/i18n.service';

interface UserProfile {
  name: string;
  picture?: string;
}

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
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent implements OnInit {
  @Input() userData: UserProfile | null = null;
  @Input() showToggle = true;
  @Input() toggleChecked = false;
  @Output() toggleMobileNav = new EventEmitter<void>();

  environmentUrl = environment.apiUrl;

  private authService = inject(AuthService);
  private http = inject(HttpClient);
  public i18n = inject(I18nService);

  ngOnInit() {
    this.http.get<{ user: UserProfile }>(environment.apiUrl + '/api/users/profile').subscribe({
      next: (res) => {
        this.userData = res.user;
      },
      error: () => {
        // handle error if needed
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

