import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ModalService } from 'src/app/services/modal/modal.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { animate, style, transition, trigger } from '@angular/animations';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-delete-role',
  standalone: true,
  templateUrl: './delete-role.component.html',
  styleUrls: ['./delete-role.component.scss'],
  imports: [CommonModule, MatDialogModule, MatButtonModule, TranslateModule],
  animations: [
    trigger('dialogPop', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-6px) scale(0.96)' }),
        animate('160ms cubic-bezier(0.2, 0, 0, 1)',
          style({ opacity: 1, transform: 'translateY(0) scale(1)' }))
      ]),
      transition(':leave', [
        animate('120ms cubic-bezier(0.4, 0, 1, 1)',
          style({ opacity: 0, transform: 'translateY(-4px) scale(0.98)' }))
      ]),
    ]),
  ],
})
export class DeleteRoleComponent {
  errorMessage = '';

  constructor(
    private dialogRef: MatDialogRef<DeleteRoleComponent, 'refresh' | undefined>,
    @Inject(MAT_DIALOG_DATA) public data: { role: any },
    private modalService: ModalService
  ) {}

  cancel(): void {
    this.dialogRef.close();
  }

  confirmDelete(): void {
    const id = this.data?.role?._id || this.data?.role?.id;
    if (!id) {
      this.errorMessage = 'Missing role id.';
      return;
    }

    this.modalService.deleteRole(id).subscribe({
      next: () => this.dialogRef.close('refresh'),
      error: (err: any) => { 
        console.error('❌ Delete error:', err);
        this.errorMessage = err?.error?.message || 'Failed to delete role. Please try again.';
      },
    });
  }
}
