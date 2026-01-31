import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminApiService, EmployeeItem, EmployeePosition } from '../../../core/admin/admin.service';

@Component({
  standalone: true,
  selector: 'app-admin-employees',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-employees.component.html',
  styleUrl: './admin-employees.component.css',
})
export class AdminEmployeesComponent {
  loading = true;
  error: string | null = null;

  employees: EmployeeItem[] = [];

  // filters
  q = '';
  position: '' | EmployeePosition = '';

  positions: EmployeePosition[] = ['WEB', 'MOBILE', 'AI', 'HR', 'TREASURER', 'IOT'];

  // disable modal
  modalOpen = false;
  disablingEmployee: EmployeeItem | null = null;
  disableReason = '';
  actionLoading = false;

  constructor(private adminApi: AdminApiService) {
    this.load();
  }

  load() {
    this.loading = true;
    this.error = null;

    const params: any = {};

    const qTrim = this.q.trim();
    if (qTrim) params.q = qTrim;

    if (this.position) params.position = this.position;

    this.adminApi.listEmployees(params).subscribe({
      next: (list) => {
        this.employees = list;
        this.loading = false;
      },
      error: (err) => {
        // err.error.message peut être string OU array
        const msg = err?.error?.message;
        this.error = Array.isArray(msg)
          ? msg.join(', ')
          : (msg || 'Impossible de charger les employés.');
        this.loading = false;
      },
    });
  }

  applyFilters() {
    this.load();
  }

  clearFilters() {
    this.q = '';
    this.position = '';
    this.load();
  }

  enable(emp: EmployeeItem) {
    if (this.actionLoading) return;
    this.actionLoading = true;

    this.adminApi.enableEmployee(emp.id).subscribe({
      next: () => {
        this.actionLoading = false;
        this.load();
      },
      error: (err) => {
        this.actionLoading = false;
        const msg = err?.error?.message;
        this.error = Array.isArray(msg) ? msg.join(', ') : (msg || 'Erreur lors de l’activation.');
      },
    });
  }

  openDisable(emp: EmployeeItem) {
    this.error = null;
    this.disablingEmployee = emp;
    this.disableReason = '';
    this.modalOpen = true;
  }

  closeDisable() {
    this.modalOpen = false;
    this.disablingEmployee = null;
    this.disableReason = '';
  }

  confirmDisable() {
    if (!this.disablingEmployee || this.actionLoading) return;

    const reason = this.disableReason.trim();
    if (!reason) {
      this.error = 'La raison est obligatoire.';
      return;
    }

    this.actionLoading = true;
    this.adminApi.disableEmployee(this.disablingEmployee.id, reason).subscribe({
      next: () => {
        this.actionLoading = false;
        this.closeDisable();
        this.load();
      },
      error: (err) => {
        this.actionLoading = false;
        const msg = err?.error?.message;
        this.error = Array.isArray(msg) ? msg.join(', ') : (msg || 'Erreur lors de la désactivation.');
      },
    });
  }

  badgeClass(isActive: boolean) {
    return isActive ? 'text-bg-success' : 'text-bg-danger';
  }
}
