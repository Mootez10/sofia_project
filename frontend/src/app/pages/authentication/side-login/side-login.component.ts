import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { ModalService } from 'src/app/services/modal/modal.service'; // ✅ Your new modal service

@Component({
  selector: 'app-side-login',
  standalone: true,
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './side-login.component.html',
})
export class AppSideLoginComponent implements AfterViewInit {
  loginData = { email: '', password: '' };
  errorMessage: string = '';

  @ViewChild('loginSuccessModal') successModalRef!: ElementRef;
  @ViewChild('loginErrorModal') errorModalRef!: ElementRef;


  constructor(
    private router: Router,
    private authService: AuthService,
    private modalService: ModalService
  ) { }

  ngAfterViewInit() {
    // Register modal in service
    this.modalService.registerModal('loginSuccess', this.successModalRef.nativeElement);
    this.modalService.registerModal('loginError', this.errorModalRef.nativeElement);

  }

  onLogin() {
    this.errorMessage = '';
    const { email, password } = this.loginData;

    this.authService.signin(email, password).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('userRole', response.user.role);
        this.authService.getRedirectPath().subscribe({
          next: (res) => {
            // ✅ Show modal, then hide and redirect
            this.modalService.showModal('loginSuccess');

            setTimeout(() => {
              this.modalService.hideModal('loginSuccess');
              this.router.navigate([res.path]);
            }, 2000); // Delay for user to read the message
          },
          error: () => {
            this.router.navigate(['/profile']);
          }
        });
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Login failed. Please try again.';
        this.modalService.showModal('loginError');

        
        setTimeout(() => {
          this.modalService.hideModal('loginError');
        }, 2000);
      },
    });
  }
}
