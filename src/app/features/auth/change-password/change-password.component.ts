import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { TokenStorageService } from '../../../core/auth/token-storage.service';

@Component({
  standalone: true,
  selector: 'app-change-password',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css',
})
export class ChangePasswordComponent {
  form!: FormGroup;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private storage: TokenStorageService,
    private router: Router,
  ) {
    this.form = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    });
  }

  submit() {
    if (this.form.invalid || this.loading) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.form.value.newPassword !== this.form.value.confirmPassword) {
      this.error = 'Les mots de passe ne correspondent pas.';
      return;
    }

    this.loading = true;
    this.error = null;

    this.auth.changePassword(
      this.form.value.currentPassword,
      this.form.value.newPassword
    ).subscribe({
      next: () => {
        const user = this.storage.getUser();
        if (user) {
          user.mustChangePassword = false;
          this.storage.setUser(user);
        }

        this.router.navigateByUrl(
          user?.role === 'ADMIN' ? '/admin/dashboard' : '/employee/dashboard'
        );
      },
      error: (err) => {
        this.error = err?.error?.message || 'Erreur lors du changement de mot de passe.';
        this.loading = false;
      },
    });
  }
}
