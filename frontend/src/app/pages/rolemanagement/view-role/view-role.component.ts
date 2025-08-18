import { Component, OnInit, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RoleService } from '../../../services/role/role.service';
import { TranslateModule } from '@ngx-translate/core';
import { MESSAGES } from 'src/constants/messages';

interface RoleDto {
  _id?: string;
  id?: string;
  name: string;
  description: string;
  actions: string[];
}

@Component({
  selector: 'app-view-role',
  standalone: true,
  templateUrl: './view-role.component.html',
  styleUrls: ['./view-role.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    TranslateModule,
  ],
})
export class ViewRoleComponent implements OnInit {
  // dialog services via inject()
  private readonly dialogRef = inject(MatDialogRef<ViewRoleComponent>);
  private readonly roleService = inject(RoleService);
  readonly data = inject(MAT_DIALOG_DATA) as { role: RoleDto };

  role: RoleDto | undefined;
  actionNames: string[] = [];
  loading = true;
  error = '';

  ngOnInit(): void {
    this.role = this.data.role;

    // Show any preloaded action names immediately
    if (Array.isArray(this.role?.actions) && this.role.actions.length > 0) {
      this.actionNames = this.role.actions.map((a) => a).filter(Boolean);
      this.loading = false;
    }

    // Fetch authoritative actions from API
    const id = this.role?._id || this.role?.id;
    if (!id) {
      this.loading = false;
      return;
    }

    this.roleService.getRoleWithActions(id).subscribe({
      next: (res: { actions: ({ name?: string } | string)[] }) => {
        if (Array.isArray(res?.actions)) {
          this.actionNames = res.actions
            .map((a) => (typeof a === 'string' ? a : a?.name))
            .filter(Boolean) as string[];
        }
        this.loading = false;
      },
      error: (err: unknown) => {
        console.error(MESSAGES.FAILED_TO_LOAD_ACTIONS, err);
        this.error = MESSAGES.FAILED_TO_LOAD_ACTIONS;
        this.loading = false;
      },
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
