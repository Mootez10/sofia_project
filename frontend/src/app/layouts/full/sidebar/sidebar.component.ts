import { HttpClient } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { environment } from 'src/environments/environment';
import { inject } from '@angular/core';

import { NavItem } from './nav-item/nav-item';

// Standalone recursive item component
import { AppNavItemComponent } from './nav-item/nav-item.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    TablerIconsModule,
    MaterialModule,
    RouterModule,
    TranslateModule,
    AppNavItemComponent,
  ],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {
  @Input() userData: { name?: string } | null = null;
  @Input() showToggle = true;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();

  // ✅ use the array, not the type
  @Input() navItems: NavItem[] = [];

  constructor() {
    this.http = inject(HttpClient);
  }
  private http: HttpClient;

  ngOnInit() {
    this.http.get<{ user: { name: string } }>(environment.apiUrl + '/api/users/profile').subscribe({
      next: (res) => (this.userData = res?.user),
      error: () => console.error('Failed to load user data'),
    });
  }

  trackByRoute = (_: number, item: NavItem) => item.route || item.navCap || '';
}
