import { Component, Inject } from '@angular/core';
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

@Component({
  selector: 'app-edit-user',
  standalone: true,
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule, // ✅ Add this
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatOptionModule
  ]
})
export class EditUserComponent {
  environment = environment;
  user: any;
  selectedFile: File | null = null;

  constructor(
    private dialogRef: MatDialogRef<EditUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: any },
    private http: HttpClient
  ) {
    this.user = { ...data.user };
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] || null;
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

    this.http.put(`${environment.apiUrl}/api/users/${this.user._id || this.user.id}`, formData).subscribe({
      next: () => {
        this.dialogRef.close('refresh');
      },
      error: (err) => {
        console.error('Error updating user:', err);
      }
    });
  }
}
