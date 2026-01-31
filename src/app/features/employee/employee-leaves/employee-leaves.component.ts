import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { EmployeeApiService } from '../../../core/api/employee-api.service';

type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
type LeaveType = 'ANNUAL' | 'SICK' | 'OTHER';

@Component({
  standalone: true,
  selector: 'app-employee-leaves',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './employee-leaves.component.html',
  styleUrl: './employee-leaves.component.css',
})
export class EmployeeLeavesComponent implements OnInit {
  loading = true;
  submitting = false;

  leaves: any[] = [];


  form = {
    type: 'ANNUAL' as LeaveType,
    startDate: '',
    endDate: '',
    reason: '',
  };

  
  successMsg = '';
  errorMsg = '';

  constructor(private api: EmployeeApiService) {}

  ngOnInit(): void {
    this.loadLeaves();
  }

  loadLeaves() {
    this.loading = true;
    this.api.getMyLeaves().subscribe({
      next: (data) => {
        this.leaves = data ?? [];
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err?.error?.message || 'Failed to load leaves';
      },
    });
  }

  submit() {
    this.successMsg = '';
    this.errorMsg = '';

    if (!this.form.startDate || !this.form.endDate) {
      this.errorMsg = 'Please choose start and end dates.';
      return;
    }

    this.submitting = true;

    const dto = {
      type: this.form.type,
      startDate: this.form.startDate,
      endDate: this.form.endDate,
      reason: this.form.reason?.trim() || null,
    };

    this.api.requestLeave(dto).subscribe({
      next: () => {
        this.submitting = false;
        this.successMsg = 'Leave request submitted ✅';
       
        this.form.reason = '';
        this.loadLeaves();
      },
      error: (err) => {
        this.submitting = false;
        this.errorMsg = err?.error?.message || 'Request failed';
      },
    });
  }

  statusBadgeClass(s: LeaveStatus) {
    if (s === 'PENDING') return 'badge bg-warning text-dark';
    if (s === 'APPROVED') return 'badge bg-success';
    return 'badge bg-danger';
  }

  typeLabel(t: LeaveType) {
    if (t === 'ANNUAL') return 'Annual';
    if (t === 'SICK') return 'Sick';
    return 'Other';
  }
}
