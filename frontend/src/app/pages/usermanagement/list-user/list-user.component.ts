import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AddUserComponent } from '../add-user/add-user.component';
import { ViewUserComponent } from '../view-user/view-user.component';
import { EditUserComponent } from '../edit-user/edit-user.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ModalService } from 'src/app/services/modal/modal.service';
import { TranslateModule } from '@ngx-translate/core';
import { MESSAGES } from 'src/constants/messages';

@Component({
  selector: 'app-list-user',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatSnackBarModule, TranslateModule],
  templateUrl: './list-user.component.html',
  styleUrl: './list-user.component.scss',
})
export class ListUserComponent implements OnInit {
  userRole: string | null = null;
  users: { _id?: string; id?: string; name: string; email: string; role: string; picture?: string; description?: string }[] = [];
  errorMessage = '';
  newUser: { name: string; email: string; password: string; picture: File | null } = {
    name: '',
    email: '',
    password: '',
    picture: null,
  };

  selectedUser: { _id?: string; id?: string; name: string; email: string; role: string; picture?: string; description?: string } | null = null;

  private http = inject(HttpClient);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private authService = inject(AuthService);
  private modalService = inject(ModalService);

  ngOnInit(): void {
    this.userRole = localStorage.getItem('userRole');
    this.loadUsers();
  }

  loadUsers(): void {
    this.http.get<{ _id?: string; id?: string; name: string; email: string; role: string; picture?: string; description?: string }[]>(`${environment.apiUrl}/api/users`).subscribe({
      next: (res) => (this.users = res),
      error: (err) => {
        console.error(MESSAGES.FAILED_TO_LOAD_ACTIONS, err);
        this.errorMessage = MESSAGES.FAILED_TO_LOAD_ACTIONS;
      },
    });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(AddUserComponent, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'refresh') {
        this.loadUsers();
      }
    });
  }

  getImageUrl(picturePath: string): string {
    return `${environment.apiUrl}${picturePath}`;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.newUser.picture = file;
    }
  }

  createUser(): void {
    const formData = new FormData();
    formData.append('name', this.newUser.name);
    formData.append('email', this.newUser.email);
    formData.append('password', this.newUser.password);
    if (this.newUser.picture) {
      formData.append('picture', this.newUser.picture);
    }

    this.http.post(`${environment.apiUrl}/api/users`, formData).subscribe({
      next: () => {
        this.loadUsers();
        this.newUser = { name: '', email: '', password: '', picture: null };
      },
      error: (err) => {
        console.error(MESSAGES.FAILED_TO_CREATE_ROLE, err);
      },
    });
  }

  viewUser(user: { _id?: string; id?: string; name: string; email: string; role: string; picture?: string; description?: string }): void {
    const userId = user.id || user._id;
    if (!userId) {
      console.error('User ID is missing:', user);
      return;
    }

    this.http.get(`${environment.apiUrl}/api/users/${userId}`).subscribe({
      next: (user) => {
        this.dialog.open(ViewUserComponent, {
          width: '600px',
          panelClass: 'custom-dialog-container',
          data: { user }
        });
      },
      error: (err) => {
        console.error(MESSAGES.FAILED_TO_LOAD_ACTIONS, err);
      }
    });
  }

  editUser(user: { _id?: string; id?: string; name: string; email: string; role: string; picture?: string; description?: string }): void {
    this.dialog.open(EditUserComponent, {
      width: '600px',
      panelClass: 'custom-dialog-container',
      data: { user }
    }).afterClosed().subscribe((result) => {
      if (result === 'refresh') {
        this.loadUsers();
      }
    });
  }

  deleteUser(user: { _id?: string; id?: string; name: string; email: string; role: string; picture?: string; description?: string }) {
    this.modalService.openDeleteUser(user).afterClosed().subscribe(res => {
      if (res === 'refresh') {
        this.loadUsers(); // refresh your table
      }
    });
  }
}
  

