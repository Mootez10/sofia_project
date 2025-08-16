import { Component, Inject, OnInit } from '@angular/core';
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
    TranslateModule
  ]
})
export class ViewRoleComponent implements OnInit {
  role: any;
  // will hold action names regardless of where they come from
  actionNames: string[] = [];
  loading = true;
  error = '';

  constructor(
    public dialogRef: MatDialogRef<ViewRoleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { role: any },
    private roleService: RoleService
  ) {}

  ngOnInit(): void {
    this.role = this.data.role;

    // If the table row already contains names, show them immediately…
    if (Array.isArray(this.role?.actions) && this.role.actions.length > 0) {
      // could be strings or Action docs
      this.actionNames = this.role.actions.map((a: any) => (typeof a === 'string' ? a : a?.name)).filter(Boolean);
      this.loading = false;
    }

    // …but also fetch the authoritative list from /api/roles/:id/actions
    const id = this.role?._id || this.role?.id;
    if (!id) { this.loading = false; return; }

   // Fetch actions from RoleAction join
    this.roleService.getRoleWithActions(id).subscribe({
      next: (res: any) => {
        // Backend returns: { role, actions: [Action docs] }
        if (Array.isArray(res?.actions)) {
          this.actionNames = res.actions
            .map((a: any) => a?.name || a)  // tolerate strings or docs
            .filter(Boolean);
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load actions:', err);
        this.error = 'Failed to load actions.';
        this.loading = false;
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
