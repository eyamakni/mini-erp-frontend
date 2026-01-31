import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  FormGroup,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {
  JobsApiService,
  JobContractType,
} from '../../../core/jobs/jobs-api.service';

@Component({
  standalone: true,
  selector: 'app-admin-jobs-create',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './admin-jobs-create.component.html',
})
export class AdminJobsCreateComponent {
  form!: FormGroup;
  loading = false;
  error: string | null = null;

  types: JobContractType[] = ['CDI', 'CDD', 'INTERN', 'FREELANCE'];

  constructor(
    private fb: FormBuilder,
    private api: JobsApiService,
    private router: Router
  ) {
    this.form = this.fb.group({
      position: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
      requiredSkills: ['', [Validators.required, Validators.minLength(5)]],
      contractType: ['', Validators.required],
      deadline: [''],
    });
  }

  submit() {
    if (this.form.invalid || this.loading) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = null;

    this.api.create(this.form.value).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigateByUrl('/admin/jobs');
      },
      error: (err) => {
        this.loading = false;
        this.error =
          err?.error?.message || 'Erreur lors de la création de l’offre.';
      },
    });
  }

  cancel() {
    this.router.navigateByUrl('/admin/jobs');
  }
}
