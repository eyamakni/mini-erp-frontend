import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TokenStorageService } from '../../../core/auth/token-storage.service';
import { AuthService } from '../../../core/auth/auth.service';
import { AdminApiService, AdminDashboardStats } from '../../../core/admin/admin.service';
import { AdminNotification } from '../../../core/admin/admin.service';
@Component({
  standalone: true,
  selector: 'app-admin-dashboard',
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent {
  user: any;
  loading = true;
  error: string | null = null;
  notifications: AdminNotification[] = [];
notificationsLoading = true;

  stats: AdminDashboardStats | null = null;

  constructor(
    private storage: TokenStorageService,
    private auth: AuthService,
    private adminApi: AdminApiService,
    private router: Router,
  ) {
    this.user = this.storage.getUser();
    this.load();
  }

  load() {
    this.loading = true;
    this.error = null;

    this.adminApi.getDashboard().subscribe({
      next: (data) => {
        this.stats = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Impossible de charger le dashboard.';
        this.loading = false;
      },
    });
    this.adminApi.getAdminNotifications().subscribe({
  next: (leaves) => {
    this.notifications = leaves.map(l => ({
      id: l.id,
      createdAt: l.createdAt,
      message: `${l.employee.firstName} ${l.employee.lastName} a demandé un congé (${l.type})`,
      link: `/admin/leaves/${l.id}`,
    }));
    this.notificationsLoading = false;
  },
  error: () => {
    this.notificationsLoading = false;
  },
});

  }

  logout() {
    this.auth.logout().subscribe({
      next: () => this.router.navigateByUrl('/login'),
      error: () => {
        // même si l'API logout plante, on clean local (optionnel)
        this.storage.clear();
        this.router.navigateByUrl('/login');
      },
    });
  }
}
