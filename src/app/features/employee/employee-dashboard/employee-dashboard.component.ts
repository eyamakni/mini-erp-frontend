import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { TokenStorageService } from '../../../core/auth/token-storage.service';

@Component({
  standalone: true,
  selector: 'app-employee-dashboard',
  imports: [CommonModule],
  templateUrl: './employee-dashboard.component.html',
  styleUrl: './employee-dashboard.component.css',
})
export class EmployeeDashboardComponent {
  user: any;

  constructor(
    private auth: AuthService,
    private storage: TokenStorageService,
    private router: Router,
  ) {
    
    this.user = this.storage.getUser();
  }

  logout() {
    this.auth.logout().subscribe({
      next: () => {
        this.router.navigateByUrl('/login');
      },
    });
  }
}
