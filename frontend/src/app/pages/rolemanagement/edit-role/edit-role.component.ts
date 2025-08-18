import { Component, OnInit, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { RoleService } from '../../../services/role/role.service';
import { TranslateModule } from '@ngx-translate/core';
import { MESSAGES } from 'src/constants/messages';

@Component({
  selector: 'app-edit-role',
  standalone: true,
  templateUrl: './edit-role.component.html',
  styleUrls: ['./edit-role.component.scss'],
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
export class EditRoleComponent implements OnInit {
  role = {
    _id: '',
    name: '',
    description: '',
    actions: [] as string[]
  };

  groupedActions: Record<string, string[]> = {};
  errorMessage = '';
  loading = false;

  private dialogRef = inject(MatDialogRef<EditRoleComponent>);
  private http = inject(HttpClient);
  private roleService = inject(RoleService);
  private data = inject(MAT_DIALOG_DATA) as { role: { _id: string; name: string; description: string; actions: string[] } };

  constructor() {
    this.role = { ...this.data.role };
  }

  ngOnInit(): void {
    this.role = { ...this.data.role };
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
    if (index >= 0) {
      this.role.actions.splice(index, 1);
    } else {
      this.role.actions.push(action);
    }
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

    this.roleService.updateRole(this.role._id, {
      name: this.role.name,
      description: this.role.description,
      actions: this.role.actions
    }).subscribe({
      next: () => this.dialogRef.close('refresh'),
      error: (err) => {
        console.error(MESSAGES.FAILED_TO_UPDATE_ROLE, err);
        this.errorMessage = MESSAGES.FAILED_TO_UPDATE_ROLE;
        this.loading = false;
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}

