import { Component, OnInit } from '@angular/core';
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
  ]
})
export class AddUserComponent implements OnInit {
  user: any = {
    Name: '',
    EmailAdress: '',
    Password: '',
    Role: '',
    Description: '',
  };

  roles: any[] = [];
  selectedFile: File | null = null;
  message = '';
  emailTaken = false;

  constructor(
    private dialogRef: MatDialogRef<AddUserComponent>,
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.http.get<any[]>(`${environment.apiUrl}/api/roles`).subscribe({
      next: (res) => {
        this.roles = res;
        // Set default role if needed
        if (this.roles.length) {
          this.user.Role = this.roles[0].name;
          this.setDescriptionBasedOnRole();
        }
      },
      error: (err) => {
        console.error('Failed to load roles:', err);
      }
    });
  }

  // Set description based on selected role
  setDescriptionBasedOnRole(): void {
    const role = this.user.Role;
    switch (role) {
      case 'admin':
        this.user.Description = 'Full access to all features';
        break;
      case 'developer':
        this.user.Description = 'Developer role with limited management rights';
        break;
      case 'user':
        this.user.Description = 'Basic user role with dashboard access only';
        break;
      default:
        this.user.Description = '';
    }
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] || null;
  }

  submit(): void {
    const formData = new FormData();
    formData.append('name', this.user.Name || '');
    formData.append('emailAdress', this.user.EmailAdress || '');
    formData.append('password', this.user.Password || '');
    formData.append('role', this.user.Role || 'user');
    formData.append('description', this.user.Description || '');

    if (this.selectedFile) {
      formData.append('picture', this.selectedFile);
    }

    this.http.post(`${environment.apiUrl}/api/users/add`, formData).subscribe({
      next: () => {
        this.message = 'Création réussie !';
        this.emailTaken = false;
        this.dialogRef.close('refresh');
        this.router.navigate(['/dashboard/users']);
      },
      error: (err) => {
        console.error(err);
        if (
          err.status === 400 &&
          err.error?.message?.toLowerCase().includes('email already')
        ) {
          this.emailTaken = true;
          this.cdr.detectChanges();
        } else {
          this.message = 'Erreur lors de la création.';
        }
      }
    });
  }
}
