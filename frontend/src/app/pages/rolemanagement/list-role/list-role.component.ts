import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { environment } from 'src/environments/environment';
import { AddRoleComponent } from '../add-role/add-role.component';
import { ViewRoleComponent } from '../view-role/view-role.component';
import { EditRoleComponent } from '../edit-role/edit-role.component';
import { DeleteRoleComponent } from '../delete-role/delete-role.component';
import { TranslateModule } from '@ngx-translate/core';



export interface RoleElement {
  _id?: string;
  name: string;
  description: string;
  actions: string[];
}

@Component({
  selector: 'app-list-role',
  standalone: true,
  templateUrl: './list-role.component.html',
  styleUrls: ['./list-role.component.scss'],
  imports: [CommonModule, MatTableModule, MatPaginatorModule, TranslateModule],
})
export class ListRoleComponent implements OnInit {
  userRole: string | null = null;
  displayedColumns: string[] = ['name', 'description', 'actions'];
  dataSource = new MatTableDataSource<RoleElement>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private http = inject(HttpClient);
  private dialog = inject(MatDialog);

  ngOnInit(): void {
    this.fetchRoles();
  }

  fetchRoles(): void {
    this.http.get<RoleElement[]>(`${environment.apiUrl}/api/roles`).subscribe({
      next: (res) => {
        this.dataSource.data = res;
        this.dataSource.paginator = this.paginator;
      },
      error: (err) => {
        console.error('❌ Failed to fetch roles:', err);
      }
    });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(AddRoleComponent, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'refresh') {
        this.fetchRoles();
      }
    });
  }

  viewRole(role: RoleElement): void {
    this.dialog.open(ViewRoleComponent, {
      width: '600px',
      data: { role }
    });
  }

  editRole(role: RoleElement): void {
    const dialogRef = this.dialog.open(EditRoleComponent, {
      width: '600px',
      data: { role }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'refresh') {
        this.fetchRoles();
      }
    });
  }

  deleteRole(role: RoleElement): void {
    const dialogRef = this.dialog.open(DeleteRoleComponent, {
      width: '400px',
      data: { role }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'refresh') {
        this.fetchRoles();
      }
    });
  }
}
