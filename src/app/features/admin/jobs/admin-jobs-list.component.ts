import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { JobsApiService, JobOffer } from '../../../core/jobs/jobs-api.service';

@Component({
  standalone: true,
  selector: 'app-admin-jobs-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-jobs-list.component.html',
})
export class AdminJobsListComponent {
  jobs: JobOffer[] = [];
  loading = false;
  error: string | null = null;

  constructor(private jobsApi: JobsApiService) {
    this.load();
  }

  load() {
    this.loading = true;
    this.error = null;

    this.jobsApi.listPublic().subscribe({
      next: (res) => {
        this.jobs = res;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.error =
          err?.error?.message || 'Impossible de charger les offres d’emploi.';
      },
    });
  }

  close(job: JobOffer) {
    if (job.status !== 'OPEN') return;

    const confirmClose = confirm(
      `Voulez-vous vraiment fermer l’offre "${job.position}" ?`
    );
    if (!confirmClose) return;

    this.jobsApi.close(job.id).subscribe({
      next: () => {
        this.load();
      },
      error: (err) => {
        this.error =
          err?.error?.message || 'Erreur lors de la fermeture de l’offre.';
      },
    });
  }

  badgeClass(status: string) {
    return status === 'OPEN' ? 'bg-success' : 'bg-secondary';
  }
}
