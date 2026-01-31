import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AdminApiService, LeaveDetails } from '../../../core/admin/admin.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-admin-leave-detail',
  imports: [CommonModule, RouterModule,FormsModule],
  templateUrl: './admin-leave-detail.component.html',
  styleUrl: './admin-leave-detail.component.css',
})
export class AdminLeaveDetailComponent {
  leave!: LeaveDetails;
  loading = true;
  error: string | null = null;
decisionLoading = false;
decisionDone: 'APPROVED' | 'REJECTED' | null = null;
decisionError: string | null = null;
comment = '';

  constructor(
    private route: ActivatedRoute,
    private adminApi: AdminApiService,
      private router: Router,   

  ) {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.load(id);
  }

  load(id: number) {
    this.loading = true;
    this.error = null;

    this.adminApi.getLeave(id).subscribe({
      next: (data) => {
        this.leave = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Impossible de charger le congé.';
        this.loading = false;
      },
    });
  }

  badgeClass(status: string) {
    if (status === 'PENDING') return 'text-bg-warning';
    if (status === 'APPROVED') return 'text-bg-success';
    return 'text-bg-danger';
  }
  approve() {
  this.makeDecision('APPROVED');
}

reject() {
  this.makeDecision('REJECTED');
}

makeDecision(decision: 'APPROVED' | 'REJECTED') {
  if (this.decisionLoading) return;

  this.decisionLoading = true;
  this.decisionError = null;

  this.adminApi.decideLeave(this.leave.id, decision, this.comment).subscribe({
    next: () => {
      this.decisionDone = decision;
      this.leave.status = decision;
      this.leave.adminComment = this.comment || null;
      this.decisionLoading = false;

      setTimeout(() => {
        this.router.navigateByUrl('/admin/leaves');
      }, 1800); // 1.8s (temps de voir l’animation)
    },
    error: (err) => {
      this.decisionError =
        err?.error?.message || 'Erreur lors de la décision.';
      this.decisionLoading = false;
    },
  });
}


}
