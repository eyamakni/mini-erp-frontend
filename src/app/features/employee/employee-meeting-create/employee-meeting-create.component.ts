import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { EmployeeApiService } from '../../../core/api/employee-api.service';
import { TokenStorageService } from '../../../core/auth/token-storage.service';

type EmployeeLite = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  position?: string | null;
};

@Component({
  standalone: true,
  selector: 'app-employee-meeting-create',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './employee-meeting-create.component.html',
  styleUrl: './employee-meeting-create.component.css',
})
export class EmployeeMeetingCreateComponent implements OnInit {
  user: any;

  employees: EmployeeLite[] = [];
  loadingUsers = true;

  submitting = false;
  successMsg = '';
  errorMsg = '';

  title = '';
  description = '';
  startAtLocal = ''; 
  durationMinutes = 30;
  participantIds: number[] = [];

  constructor(
    private api: EmployeeApiService,
    private storage: TokenStorageService,
    private router: Router,
  ) {
    this.user = this.storage.getUser();
  }

  ngOnInit(): void {
    this.api.getEmployees().subscribe({
      next: (data) => {
        const list = (data ?? []) as EmployeeLite[];
        this.employees = list.filter((e) => e.id !== this.user?.id);
        this.loadingUsers = false;
      },
      error: (err) => {
        this.loadingUsers = false;
        this.errorMsg = err?.error?.message || 'Failed to load employees';
      },
    });
  }

  toggle(id: number, checked: boolean) {
    if (checked) {
      if (!this.participantIds.includes(id)) this.participantIds.push(id);
    } else {
      this.participantIds = this.participantIds.filter((x) => x !== id);
    }
  }

  submit() {
    this.successMsg = '';
    this.errorMsg = '';

    const title = this.title.trim();
    if (!title) {
      this.errorMsg = 'Title is required.';
      return;
    }
    if (!this.startAtLocal) {
      this.errorMsg = 'Start date/time is required.';
      return;
    }

    const duration = Number(this.durationMinutes);
    if (!Number.isInteger(duration) || duration < 5) {
      this.errorMsg = 'Duration must be an integer ≥ 5.';
      return;
    }

    const startAtISO = new Date(this.startAtLocal).toISOString();

    const dto = {
      title,
      description: this.description.trim() ? this.description.trim() : undefined,
      startAt: startAtISO,
      durationMinutes: duration,
      participantIds: this.participantIds,
    };

    this.submitting = true;

    this.api.createMeeting(dto).subscribe({
      next: () => {
        this.submitting = false;
        this.successMsg = 'Meeting created ✅';
        setTimeout(() => this.router.navigateByUrl('/employee/meetings'), 600);
      },
      error: (err) => {
        this.submitting = false;
        this.errorMsg = err?.error?.message || 'Create meeting failed';
      },
    });
  }
}
