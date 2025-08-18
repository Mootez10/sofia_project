import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TranslateModule } from '@ngx-translate/core';
import { MESSAGES } from 'src/constants/messages';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatOptionModule,
    TranslateModule
  ]
})
export class EditUserComponent implements OnInit {
  environment = environment;
  user: { _id?: string; id?: string; name: string; email: string; role: string; description: string; picture?: string } = {
    name: '',
    email: '',
    role: '',
    description: '',
  };
  selectedFile: File | null = null;

  roles: { name: string }[] = [];
  loadingRoles = true;
  rolesError = '';

  private dialogRef = inject(MatDialogRef<EditUserComponent>);
  private http = inject(HttpClient);
  private data = inject(MAT_DIALOG_DATA) as { user: { _id?: string; id?: string; name: string; email: string; role: string; description: string; picture?: string } };

  constructor() {
    this.user = { ...this.data.user };
  }

  ngOnInit(): void {
    this.fetchRoles();
    this.setDescriptionBasedOnRole();
  }

  private fetchRoles(): void {
    this.loadingRoles = true;
    this.rolesError = '';
    this.http.get<{ name: string }[]>(`${environment.apiUrl}/api/roles`).subscribe({
      next: (res) => {
        this.roles = res || [];

        if (this.user?.role && !this.roles.some(r => r.name === this.user.role)) {
          this.roles.push({ name: this.user.role });
        }

        this.loadingRoles = false;
      },
      error: (err) => {
        console.error(MESSAGES.FAILED_TO_LOAD_ACTIONS, err);
        this.rolesError = MESSAGES.FAILED_TO_LOAD_ACTIONS;
        const fallback = [{ name: 'admin' }, { name: 'user' }];
        this.roles = [...fallback];

        if (this.user?.role && !this.roles.some(r => r.name === this.user.role)) {
          this.roles.push({ name: this.user.role });
        }

        this.loadingRoles = false;
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] || null;
  }

  setDescriptionBasedOnRole(): void {
  switch (this.user.role) {
    case 'admin':
      this.user.description = 'Full access to all features';
      break;
    case 'developer':
      this.user.description = 'Developer role with limited management rights';
      break;
    case 'user':
      this.user.description = 'Basic user role with dashboard access only';
      break;
    default:
      this.user.description = '';
  }
}


  submit(): void {
    const formData = new FormData();
    formData.append('name', this.user.name || '');
    formData.append('email', this.user.email || '');
    formData.append('role', this.user.role || 'user');
    formData.append('description', this.user.description || '');

    if (this.selectedFile) {
      formData.append('picture', this.selectedFile);
    }

    const id = this.user._id || this.user.id;
    this.http.put(`${environment.apiUrl}/api/users/${id}`, formData).subscribe({
      next: () => this.dialogRef.close('refresh'),
      error: (err) => console.error(MESSAGES.FAILED_TO_UPDATE_ROLE, err)
    });
  }
}
