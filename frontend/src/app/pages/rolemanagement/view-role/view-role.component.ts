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
    MatCheckboxModule
  ]
})
export class ViewRoleComponent implements OnInit {
  role: any;

  constructor(
    public dialogRef: MatDialogRef<ViewRoleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { role: any },
    private roleService: RoleService // Optional: only needed if you want to re-fetch
  ) {}

  ngOnInit(): void {
    this.role = this.data.role;
  }

  close(): void {
    this.dialogRef.close();
  }
}
