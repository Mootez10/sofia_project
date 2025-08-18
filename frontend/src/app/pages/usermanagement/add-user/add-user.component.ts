import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ChangeDetectorRef } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MESSAGES } from 'src/constants/messages';

@Component({
  selector: 'app-add-user',
  standalone: true,
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
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
export class AddUserComponent implements OnInit {
  // ✅ CHANGED: Using standard camelCase properties
  user: { name: string; email: string; password: string; role: string; description: string } = {
    name: '',
    email: '',
    password: '',
    role: '',
    description: '',
  };

  roles: { name: string }[] = [];
  selectedFile: File | null = null;
  message = '';
  emailTaken = false;

  private dialogRef = inject(MatDialogRef<AddUserComponent>);
  private http = inject(HttpClient);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.http.get<{ name: string }[]>(`${environment.apiUrl}/api/roles`).subscribe({
      next: (res) => {
        this.roles = res;
        if (this.roles.length) {
          // ✅ CHANGED: use the new 'role' property
          this.user.role = this.roles[0].name;
          this.setDescriptionBasedOnRole();
        }
      },
      error: (err) => {
        console.error(MESSAGES.FAILED_TO_LOAD_ACTIONS, err);
      }
    });
  }

  setDescriptionBasedOnRole(): void {
    // ✅ CHANGED: use the new 'role' property
    const role = this.user.role;
    switch (role) {
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

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] || null;
  }

  submit(): void {
    const formData = new FormData();
    // ✅ CHANGED: Appending with the standardized field names
    formData.append('name', this.user.name || '');
    formData.append('email', this.user.email || '');
    formData.append('password', this.user.password || '');
    formData.append('role', this.user.role || 'user');
    formData.append('description', this.user.description || '');

    if (this.selectedFile) {
      formData.append('picture', this.selectedFile);
    }

    this.http.post(`${environment.apiUrl}/api/users/add`, formData).subscribe({
      next: () => {
        this.message = MESSAGES.USER_CREATED_SUCCESS;
        this.emailTaken = false;
        this.dialogRef.close('refresh');
        this.router.navigate(['/dashboard/users']);
      },
      error: (err) => {
        console.error(MESSAGES.FAILED_TO_CREATE_ROLE, err);
        if (
          err.status === 400 &&
          err.error?.message?.toLowerCase().includes('email already')
        ) {
          this.emailTaken = true;
          this.cdr.detectChanges();
        } else {
          this.message = MESSAGES.FAILED_TO_CREATE_ROLE;
        }
      }
    });
  }
}