// src/app/pages/users/delete-user/delete-user.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ModalService } from 'src/app/services/modal/modal.service';
import { TranslateModule } from '@ngx-translate/core';
import { MESSAGES } from 'src/constants/messages';

@Component({
  selector: 'app-delete-user',
  standalone: true,
  templateUrl: './delete-user.component.html',
  styleUrls: ['./delete-user.component.scss'],
  imports: [CommonModule, MatDialogModule, MatButtonModule, TranslateModule],
})
export class DeleteUserComponent {
  errorMessage = '';

  private dialogRef = inject(MatDialogRef<DeleteUserComponent>);
  private modalService = inject(ModalService);
  private data = inject(MAT_DIALOG_DATA) as { user: { _id?: string; id?: string } };

  cancel(): void {
    this.dialogRef.close();
  }

  confirmDelete(): void {
    const id = this.data?.user?._id || this.data?.user?.id;
    if (!id) {
      this.errorMessage = MESSAGES.USER_NOT_FOUND;
      return;
    }

    this.modalService.deleteUser(id).subscribe({
      next: () => this.dialogRef.close('refresh'),
      error: (err: unknown) => {
        console.error(MESSAGES.FAILED_TO_DELETE_ROLE, err);
        this.errorMessage = (err as { error?: { message?: string } })?.error?.message || MESSAGES.FAILED_TO_DELETE_ROLE;
      },
    });
  }
}
