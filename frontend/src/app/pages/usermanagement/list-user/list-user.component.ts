import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Tooltip } from 'bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AddUserComponent } from '../add-user/add-user.component';
import { ViewUserComponent } from '../view-user/view-user.component';
import { EditUserComponent } from '../edit-user/edit-user.component';
import { DeleteUserComponent } from '../delete-user/delete-user.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ModalService } from 'src/app/services/modal/modal.service';





declare const bootstrap: any;

@Component({
  selector: 'app-list-user',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatSnackBarModule],
  templateUrl: './list-user.component.html',
  styleUrl: './list-user.component.scss',
})
export class ListUserComponent implements OnInit {
  userRole: string | null = null;
  users: any[] = [];
  errorMessage = '';
  newUser: any = {
    name: '',
    email: '',
    password: '',
    picture: null,
  };

  selectedUser: any = null;

  constructor(private http: HttpClient, private dialog: MatDialog, private snackBar: MatSnackBar, private authService : AuthService, private modalService: ModalService,) {}

  ngOnInit(): void {
    this.userRole = localStorage.getItem('userRole');
    this.loadUsers();
    console.log("from decode",this.authService.getCurrentUserFromToken())
    setTimeout(() => {
      const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
      tooltipTriggerList.forEach((el) => new Tooltip(el));
    });
  }

  loadUsers(): void {
    this.http.get<any[]>(`${environment.apiUrl}/api/users`).subscribe({
      next: (res) => (this.users = res),
      error: (err) => {
        console.error('Failed to fetch users', err);
        this.errorMessage = 'Could not load users.';
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

  onFileSelected(event: any): void {
    const file = event.target.files[0];
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
        console.error('User creation failed:', err);
      },
    });
  }

  viewUser(user: any): void {
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
      console.error('Failed to load user:', err);
    }
  });
}


  editUser(user: any): void {
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

// In your users list component
deleteUser(user: any) {
  this.modalService.openDeleteUser(user).afterClosed().subscribe(res => {
    if (res === 'refresh') {
      this.loadUsers(); // refresh your table
    }
  });
}
}

