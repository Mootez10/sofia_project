import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-authorized',
  imports: [CommonModule],
  templateUrl: './not-authorized.component.html',
  styleUrl: './not-authorized.component.scss'
})
export class NotAuthorizedComponent {
  private router = inject(Router);

  goToDashboard() {
    this.router.navigate(['/dashboard/users']);
  }
}
