import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EmployeeApiService } from '../../../core/api/employee-api.service';

@Component({
  standalone: true,
  selector: 'app-employee-meetings',
  imports: [CommonModule, RouterLink],
  templateUrl: './employee-meetings.component.html',
  styleUrl: './employee-meetings.component.css',
})
export class EmployeeMeetingsComponent implements OnInit {
  loading = true;
  meetings: any[] = [];

  successMsg = '';
  errorMsg = '';

  cancelingId: number | null = null;

  constructor(private api: EmployeeApiService) {}

  ngOnInit(): void {
    this.loadMeetings();
  }

  loadMeetings() {
    this.loading = true;
    this.errorMsg = '';
    this.api.getMyMeetings().subscribe({
      next: (data) => {
        this.meetings = data ?? [];
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err?.error?.message || 'Failed to load meetings';
      },
    });
  }

  cancelMeeting(id: number) {
    this.successMsg = '';
    this.errorMsg = '';

    const ok = confirm('Cancel this meeting?');
    if (!ok) return;

    this.cancelingId = id;

    this.api.cancelMeeting(id).subscribe({
      next: () => {
        this.cancelingId = null;
        this.successMsg = 'Meeting cancelled ✅';
        this.loadMeetings();
      },
      error: (err) => {
        this.cancelingId = null;
        this.errorMsg = err?.error?.message || 'Cancel failed';
      },
    });
  }

 
  endAt(m: any): Date {
    const start = new Date(m.startAt);
    const end = new Date(start.getTime() + (Number(m.durationMinutes) || 0) * 60000);
    return end;
  }
}
