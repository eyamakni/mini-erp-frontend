import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApplicationsApiService, JobApplicationDetail } from '../../../../core/applications/applications-api-service';
 import { JobApplicationItem } from '../../../../core/applications/applications-api-service';
import { ApplicationStatus } from '../../../../core/applications/applications-api-service';

@Component({
  standalone: true,
  selector: 'app-admin-application-detail',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-application-detail.component.html',
})
export class AdminApplicationDetailComponent {
  loading = true;
  saving = false;
  error: string | null = null;

  application!: JobApplicationDetail;

  status!: ApplicationStatus;
  adminNotes = '';

  decisionDone: ApplicationStatus | null = null;

  statuses: ApplicationStatus[] = [
    'NEW',
    'REVIEWED',
    'SHORTLISTED',
    'INTERVIEW',
    'REJECTED',
    'HIRED',
  ];

  constructor(
    private route: ActivatedRoute,
    private api: ApplicationsApiService,
    private router: Router
  ) {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.load(id);
  }

  load(id: number) {
    this.loading = true;

    this.api.getOneAdmin(id).subscribe({
      next: (res:JobApplicationDetail) => {
        this.application = res;
        this.status = res.status;
        this.adminNotes = res.adminNotes ?? '';
        this.loading = false;
      },
      error: () => {
        this.error = 'Candidature introuvable';
        this.loading = false;
      },
    });
  }

  save() {
    if (this.saving) return;

    this.saving = true;
    this.error = null;

    this.api.updateStatus(this.application.id, {
      status: this.status,
      adminNotes: this.adminNotes,
    }).subscribe({
      next: () => {
        this.decisionDone = this.status;

        // ⏳ animation puis redirection
        setTimeout(() => {
          this.router.navigateByUrl('/admin/applications');
        }, 1600);
      },
      error: () => {
        this.saving = false;
        this.error = 'Erreur lors de la mise à jour';
      },
    });
  }
}
