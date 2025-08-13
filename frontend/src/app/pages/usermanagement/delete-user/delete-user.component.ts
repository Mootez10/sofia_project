// src/app/pages/users/delete-user/delete-user.component.ts
import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ModalService } from 'src/app/services/modal/modal.service';

@Component({
  selector: 'app-delete-user',
  standalone: true,
  templateUrl: './delete-user.component.html',
  styleUrls: ['./delete-user.component.scss'],
  imports: [CommonModule, MatDialogModule, MatButtonModule],
})
export class DeleteUserComponent {
  errorMessage = '';

  constructor(
    private dialogRef: MatDialogRef<DeleteUserComponent, 'refresh' | undefined>,
    @Inject(MAT_DIALOG_DATA) public data: { user: any },
    private modalService: ModalService
  ) {}

  cancel(): void {
    this.dialogRef.close();
  }

  confirmDelete(): void {
    const id = this.data?.user?._id || this.data?.user?.id;
    if (!id) {
      this.errorMessage = 'Missing user id.';
      return;
    }

    this.modalService.deleteUser(id).subscribe({
      next: () => this.dialogRef.close('refresh'),
      error: (err: any) => {
        console.error('❌ Delete user error:', err);
        this.errorMessage = err?.error?.message || 'Failed to delete user. Please try again.';
      },
    });
  }
}
