// view-user.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-view-user',
  standalone: true,
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    TranslateModule
  ]
})
export class ViewUserComponent {
  environment = environment;

  constructor(
    public dialogRef: MatDialogRef<ViewUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: any }
  ) {}
}
