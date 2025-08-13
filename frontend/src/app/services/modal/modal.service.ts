import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { RoleService } from 'src/app/services/role/role.service';
import { DeleteRoleComponent } from 'src/app/pages/rolemanagement/delete-role/delete-role.component';
import { DeleteUserComponent } from 'src/app/pages/usermanagement/delete-user/delete-user.component';
import { UserService } from '../user/user.service';


@Injectable({ providedIn: 'root' })
export class ModalService {
  constructor(
    private dialog: MatDialog,
    private roleService: RoleService,
    private userService: UserService

  ) {}

  // Open the Delete Role dialog (simple, no generics beyond the dialog ref type)
  openDeleteRole(role: any): MatDialogRef<DeleteRoleComponent, 'refresh' | undefined> {
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
  deleteRole(roleId: string): Observable<any> {
    return this.roleService.deleteRole(roleId);
  }

  // ===== Users (NEW) =====
  openDeleteUser(user: any): MatDialogRef<DeleteUserComponent, 'refresh' | undefined> {
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
