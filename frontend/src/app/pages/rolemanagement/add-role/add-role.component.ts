import { Component, OnInit, inject } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { RoleService } from '../../../services/role/role.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { TranslateModule } from '@ngx-translate/core';
import { MESSAGES } from 'src/constants/messages';

@Component({
  selector: 'app-add-role',
  standalone: true,
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    TranslateModule
  ],
})
export class AddRoleComponent implements OnInit {
  currentUser: unknown;
  role = {
    name: '',
    description: '',
    actions: [] as string[]
  };

  groupedActions: Record<string, string[]> = {};
  loading = false;
  errorMessage = '';

  private dialogRef = inject(MatDialogRef<AddRoleComponent>);
  private http = inject(HttpClient);
  private roleService = inject(RoleService);
  private authService = inject(AuthService);

  ngOnInit(): void {
    this.fetchActions();
  }

  fetchActions(): void {
    this.http.get<{ name: string; path: string }[]>(`${environment.apiUrl}/api/actions`).subscribe({
      next: (res) => {
        const grouped: Record<string, string[]> = {};

        for (const action of res) {
          let group = 'Other';

          if (action.path === '/dashboard') {
            group = 'Dashboard';
          } else if (action.path.startsWith('/dashboard/users')) {
            group = 'User Management';
          } else if (action.path.startsWith('/dashboard/roles')) {
            group = 'Role Management';
          }

          if (!grouped[group]) grouped[group] = [];
          grouped[group].push(action.name);
        }

        this.groupedActions = grouped;
      },
      error: (err) => {
        console.error(MESSAGES.FAILED_TO_LOAD_ACTIONS, err);
        this.errorMessage = MESSAGES.FAILED_TO_LOAD_ACTIONS;
      }
    });
  }

  toggleAction(action: string): void {
    const index = this.role.actions.indexOf(action);
    index >= 0
      ? this.role.actions.splice(index, 1)
      : this.role.actions.push(action);
  }

  isChecked(action: string): boolean {
    return this.role.actions.includes(action);
  }

  submit(): void {
    if (!this.role.name.trim()) {
      this.errorMessage = MESSAGES.NAME_EMAIL_PASSWORD_REQUIRED;
      return;
    }

    if (this.role.actions.length === 0) {
      this.errorMessage = MESSAGES.FAILED_TO_LOAD_ACTIONS;
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.roleService.createRole(this.role).subscribe({
      next: () => this.dialogRef.close('refresh'),
      error: (err) => {
        console.error(MESSAGES.FAILED_TO_CREATE_ROLE, err);
        this.errorMessage =
          err.status === 409
            ? MESSAGES.ROLE_ALREADY_EXISTS
            : MESSAGES.FAILED_TO_CREATE_ROLE;
        this.loading = false;
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}


