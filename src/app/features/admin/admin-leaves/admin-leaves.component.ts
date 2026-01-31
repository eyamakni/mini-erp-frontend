import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminApiService, LeaveItem, LeaveStatus } from '../../../core/admin/admin.service';

@Component({
  standalone: true,
  selector: 'app-admin-leaves',
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-leaves.component.html',
  styleUrl: './admin-leaves.component.css',
})
export class AdminLeavesComponent {
  status: LeaveStatus = 'PENDING';
  leaves: LeaveItem[] = [];
  loading = true;
  error: string | null = null;

  statuses: LeaveStatus[] = ['PENDING', 'APPROVED', 'REJECTED'];

  constructor(private adminApi: AdminApiService) {
    this.load();
  }

  load() {
    this.loading = true;
    this.error = null;

    this.adminApi.listLeavesByStatus(this.status).subscribe({
      next: (list) => {
        this.leaves = list;
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Impossible de charger les congés.';
        this.loading = false;
      },
    });
  }

  changeStatus(s: LeaveStatus) {
    this.status = s;
    this.load();
  }

  badgeClass(s: LeaveStatus) {
    if (s === 'PENDING') return 'text-bg-warning';
    if (s === 'APPROVED') return 'text-bg-success';
    return 'text-bg-danger';
  }
}
