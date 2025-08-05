import { Component, OnInit } from '@angular/core';
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
    MatButtonModule
  ],
})
export class AddRoleComponent implements OnInit {
  currentUser: any;
  role = {
    name: '',
    description: '',
    actions: [] as string[]
  };

  groupedActions: Record<string, string[]> = {};
  loading = false;
  errorMessage = '';

  constructor(
    private dialogRef: MatDialogRef<AddRoleComponent>,
    private http: HttpClient,
    private roleService: RoleService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.fetchActions();
  }

 fetchActions(): void {
  this.http.get<any[]>(`${environment.apiUrl}/api/actions`).subscribe({
    next: (res) => {
      const grouped: { [key: string]: string[] } = {};

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
      console.error('❌ Failed to load actions:', err);
      this.errorMessage = 'Failed to load actions.';
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
    this.errorMessage = 'Role name is required.';
    return;
  }

  if (this.role.actions.length === 0) {
    this.errorMessage = 'At least one action must be selected.';
    return;
  }

  this.loading = true;
  this.errorMessage = '';

  this.roleService.createRole(this.role).subscribe({
    next: () => this.dialogRef.close('refresh'),
    error: (err) => {
      console.error('❌ Failed to create role:', err);
      this.errorMessage =
        err.status === 409
          ? 'Role already exists.'
          : 'Failed to create role. Please try again.';
      this.loading = false;
    }
  });
}

  close(): void {
    this.dialogRef.close();
  }
}
