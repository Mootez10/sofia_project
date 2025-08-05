import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { RoleService } from '../../../services/role/role.service';

@Component({
  selector: 'app-delete-role',
  standalone: true,
  templateUrl: './delete-role.component.html',
  styleUrls: ['./delete-role.component.scss'],
  imports: [CommonModule, MatDialogModule],
})
export class DeleteRoleComponent {
  errorMessage = '';

  constructor(
    private dialogRef: MatDialogRef<DeleteRoleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { role: any },
    private roleService: RoleService
  ) {}

  cancel(): void {
    this.dialogRef.close();
  }

  confirmDelete(): void {
    this.roleService.deleteRole(this.data.role._id).subscribe({
      next: () => this.dialogRef.close('refresh'),
      error: (err) => {
        console.error('❌ Delete error:', err);
        this.errorMessage = 'Failed to delete role. Please try again.';
      }
    });
  }
}
