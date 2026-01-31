import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { EmployeeApiService } from '../../../core/api/employee-api.service';
import { TokenStorageService } from '../../../core/auth/token-storage.service';

import { Chart, ChartConfiguration } from 'chart.js/auto';

@Component({
  standalone: true,
  selector: 'app-employee-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './employee-dashboard.component.html',
  styleUrl: './employee-dashboard.component.css',
})
export class EmployeeDashboardComponent implements OnInit, AfterViewInit {
  user: any;
  loading = true;
  dashboard: any = null;

  private leaveChart?: Chart;
  private meetingsChart?: Chart;

  constructor(
    private api: EmployeeApiService,
    private storage: TokenStorageService,
    private router: Router,
  ) {
    this.user = this.storage.getUser();
  }

  ngOnInit(): void {
    this.api.getDashboard().subscribe({
      next: (data) => {
        this.dashboard = data;
        this.loading = false;

        setTimeout(() => this.renderCharts(), 0);
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  ngAfterViewInit(): void {
  }

  private renderCharts() {
    this.renderLeaveChart();
    this.renderMeetingsChart7Days();
  }

  private renderLeaveChart() {
    const stats = this.dashboard?.leaveRequestsByStatus;
    if (!stats) return;

    const data = [stats.pending ?? 0, stats.approved ?? 0, stats.rejected ?? 0];

    // destroy old chart if exists
    this.leaveChart?.destroy();

    const config: ChartConfiguration<'doughnut'> = {
      type: 'doughnut',
      data: {
        labels: ['Pending', 'Approved', 'Rejected'],
        datasets: [
          {
            data,
            backgroundColor: ['#ffc107', '#198754', '#dc3545'],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' },
        },
        cutout: '65%',
      },
    };

    const canvas = document.getElementById('leaveChart') as HTMLCanvasElement | null;
    if (!canvas) return;
    this.leaveChart = new Chart(canvas, config);
  }

  private renderMeetingsChart7Days() {
    const meetings = this.dashboard?.upcomingMeetings ?? [];

    const days: { key: string; label: string; count: number }[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const key = d.toISOString().slice(0, 10); // YYYY-MM-DD
      const label = d.toLocaleDateString(undefined, { weekday: 'short' }); // Mon, Tue...
      days.push({ key, label, count: 0 });
    }

    for (const m of meetings) {
      const d = new Date(m.startAt);
      const key = d.toISOString().slice(0, 10);
      const bucket = days.find(x => x.key === key);
      if (bucket) bucket.count += 1;
    }

    const labels = days.map(d => d.label);
    const values = days.map(d => d.count);

    this.meetingsChart?.destroy();

    const config: ChartConfiguration<'bar'> = {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Meetings',
            data: values,
            backgroundColor: '#198754',
            borderRadius: 10,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
        },
        scales: {
          y: { beginAtZero: true, ticks: { precision: 0 } },
        },
      },
    };

    const canvas = document.getElementById('meetingsChart') as HTMLCanvasElement | null;
    if (!canvas) return;
    this.meetingsChart = new Chart(canvas, config);
  }

  logout() {
    this.api.logout().subscribe({
      next: () => {
        localStorage.clear();
        this.router.navigateByUrl('/login');
      },
      error: () => {
        localStorage.clear();
        this.router.navigateByUrl('/login');
      },
    });
  }
}
