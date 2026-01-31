import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loading = false;
  error: string | null = null;
  showPassword = false;
year = new Date().getFullYear();
  form!: FormGroup; 

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
  ) {
    
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  submit() {
    if (this.form.invalid || this.loading) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = null;

    const { email, password } = this.form.value;

    this.auth.login(email, password).subscribe({
      next: (res) => {
        if (res.user.mustChangePassword) {
          this.router.navigateByUrl('/change-password');
          return;
        }
        if (res.user.role === 'ADMIN') {
          this.router.navigateByUrl('/admin/dashboard');
        } else {
          this.router.navigateByUrl('/employee/dashboard');
        }
      },
      error: (err) => {
        this.error = err?.error?.message || 'Email ou mot de passe incorrect.';
        this.loading = false;
      },
    });
  }

  get email() { return this.form.get('email'); }
  get password() { return this.form.get('password'); }
}
