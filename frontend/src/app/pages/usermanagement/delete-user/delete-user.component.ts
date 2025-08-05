import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-delete-user',
  standalone: true,
  templateUrl: './delete-user.component.html',
  styleUrls: ['./delete-user.component.scss'],
  imports: [CommonModule, MatDialogModule, MatButtonModule],
})
export class DeleteUserComponent {
  environment = environment;

  constructor(
    private dialogRef: MatDialogRef<DeleteUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: any },
    private http: HttpClient
  ) {}

  confirmDelete(): void {
    const id = this.data.user._id || this.data.user.id;
    this.http.delete(`${environment.apiUrl}/api/users/${id}`).subscribe({
      next: () => this.dialogRef.close('refresh'),
      error: (err) => console.error('Failed to delete user:', err),
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
