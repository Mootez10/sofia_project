import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { ModalService } from 'src/app/services/modal/modal.service';

@Component({
  selector: 'app-side-register',
  standalone: true,
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './side-register.component.html',
})
export class AppSideRegisterComponent implements AfterViewInit {
  options = this.settings.getOptions();

  registerData = { name: '', email: '', password: '' };
  selectedFile: File | null = null;
  successMessage = '';
  errorMessage = '';

  @ViewChild('successModalTrigger') successModalTrigger!: ElementRef;
  @ViewChild('errorModalTrigger') errorModalTrigger!: ElementRef;
  @ViewChild('successModalRef') successModalRef!: ElementRef;
  @ViewChild('errorModalRef') errorModalRef!: ElementRef;

  constructor(
    private settings: CoreService,
    private router: Router,
    private authService: AuthService,
    private modalService: ModalService
  ) {}

  ngAfterViewInit() {
    this.modalService.registerModal('registerSuccess', this.successModalRef.nativeElement);
    this.modalService.registerModal('registerError', this.errorModalRef.nativeElement);
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onRegister() {
  this.successMessage = '';
  this.errorMessage = '';

  if (!this.registerData.name || !this.registerData.email || !this.registerData.password || !this.selectedFile) {
    this.errorMessage = 'All fields are required including profile picture.';
    this.modalService.showModal('registerError');

    setTimeout(() => {
      this.modalService.hideModal('registerError');
    }, 3000);
    return;
  }

  this.authService
    .signup(
      this.registerData.name,
      this.registerData.email,
      this.registerData.password,
      this.selectedFile
    )
    .subscribe({
      next: () => {
        this.successMessage = 'Registration successful! Please login.';
        this.modalService.showModal('registerSuccess');

        setTimeout(() => {
          this.modalService.hideModal('registerSuccess');
          this.router.navigate(['/authentication/login']);
        }, 3000);
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Sign up failed. Please try again.';
        this.modalService.showModal('registerError');

        setTimeout(() => {
          this.modalService.hideModal('registerError');
        }, 3000);
      },
    });
}

}
