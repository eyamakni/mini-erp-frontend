import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AdminApiService, EmployeePosition } from '../../../core/admin/admin.service';

@Component({
  standalone: true,
  selector: 'app-admin-create-employee',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './admin-create-employee.component.html',
  styleUrl: './admin-create-employee.component.css',
})
export class AdminCreateEmployeeComponent {
  form!: FormGroup;
  loading = false;
  error: string | null = null;
  success: { companyEmail: string; id: number } | null = null;

  positions: EmployeePosition[] = ['WEB', 'MOBILE', 'AI', 'HR', 'TREASURER', 'IOT'];

  constructor(
    private fb: FormBuilder,
    private adminApi: AdminApiService,
    private router: Router,
  ) {
    this.form = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      position: ['', Validators.required],
      personalEmail: ['', [Validators.required, Validators.email]],
    });
  }

  submit() {
    if (this.form.invalid || this.loading) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = null;

    this.adminApi.createEmployee(this.form.value).subscribe({
      next: (res) => {
        this.success = { companyEmail: res.companyEmail, id: res.id };
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Erreur lors de la création de l’employé.';
        this.loading = false;
      },
    });
  }

  goToEmployeesList() {
    this.router.navigateByUrl('/admin/employees');
  }


  get firstName() { return this.form.get('firstName'); }
  get lastName() { return this.form.get('lastName'); }
  get position() { return this.form.get('position'); }
  get personalEmail() { return this.form.get('personalEmail'); }
}
