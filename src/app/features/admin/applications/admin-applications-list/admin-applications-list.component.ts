import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApplicationsApiService } from '../../../../core/applications/applications-api-service';
 import { JobApplicationItem } from '../../../../core/applications/applications-api-service';
import { ApplicationStatus } from '../../../../core/applications/applications-api-service';
 
@Component({
  standalone: true,
  selector: 'app-admin-applications-list',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-applications-list.component.html',
})
export class AdminApplicationsListComponent {
  loading = true;
  error: string | null = null;

  applications: JobApplicationItem[] = [];

  // filters
  status: ApplicationStatus | '' = '';
  from = '';
  to = '';

  statuses: ApplicationStatus[] = [
    'NEW',
    'REVIEWED',
    'SHORTLISTED',
    'INTERVIEW',
    'REJECTED',
    'HIRED',
  ];

  constructor(private api: ApplicationsApiService) {
    this.load();
  }

  load() {
    this.loading = true;
    this.error = null;

    const params: any = {};
    if (this.status) params.status = this.status;
    if (this.from && this.to) {
      params.from = this.from;
      params.to = this.to;
    }

    this.api.listAdmin(params).subscribe({
      next: (res) => {
        this.applications = res;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.error =
          err?.error?.message ||
          'Impossible de charger les candidatures.';
      },
    });
  }

  clearFilters() {
    this.status = '';
    this.from = '';
    this.to = '';
    this.load();
  }

  badgeClass(status: ApplicationStatus) {
    switch (status) {
      case 'NEW':
        return 'bg-primary';
      case 'REVIEWED':
        return 'bg-secondary';
      case 'SHORTLISTED':
        return 'bg-info';
      case 'INTERVIEW':
        return 'bg-warning';
      case 'HIRED':
        return 'bg-success';
      case 'REJECTED':
        return 'bg-danger';
      default:
        return 'bg-light';
    }
  }
}
