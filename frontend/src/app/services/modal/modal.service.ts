import { Injectable, inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { RoleService } from 'src/app/services/role/role.service';
import { DeleteRoleComponent } from 'src/app/pages/rolemanagement/delete-role/delete-role.component';
import { DeleteUserComponent } from 'src/app/pages/usermanagement/delete-user/delete-user.component';
import { UserService } from '../user/user.service';


@Injectable({ providedIn: 'root' })
export class ModalService {
  private dialog = inject(MatDialog);
  private roleService = inject(RoleService);
  private userService = inject(UserService);

  // Open the Delete Role dialog (simple, no generics beyond the dialog ref type)
  openDeleteRole(role: { _id?: string; id?: string; name?: string }): MatDialogRef<DeleteRoleComponent, 'refresh' | undefined> {
    return this.dialog.open(DeleteRoleComponent, {
      data: { role },
      autoFocus: false,
      restoreFocus: false,
      panelClass: ['confirm-anim'],
      backdropClass: 'confirm-backdrop',
      enterAnimationDuration: '160ms',
      exitAnimationDuration: '120ms',
    });
  }

  // Perform the actual delete (HTTP call)
  deleteRole(roleId: string): Observable<unknown> {
    return this.roleService.deleteRole(roleId);
  }

  // ===== Users (NEW) =====
  openDeleteUser(user: { _id?: string; id?: string; name?: string }): MatDialogRef<DeleteUserComponent, 'refresh' | undefined> {
    return this.dialog.open(DeleteUserComponent, {
      data: { user },
      autoFocus: false,
      restoreFocus: false,
      panelClass: ['confirm-anim'],
      backdropClass: 'confirm-backdrop',
      enterAnimationDuration: '160ms',
      exitAnimationDuration: '120ms',
    });
  }

  deleteUser(userId: string): Observable<void> {
    return this.userService.deleteUser(userId);
  }
}

