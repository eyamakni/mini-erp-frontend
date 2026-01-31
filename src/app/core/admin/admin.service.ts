import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';


export interface AdminDashboardStats {
  totalEmployees: number;
  employeesByPosition: { position: string; count: number }[];
  leaves: { pending: number; approved: number; rejected: number };
  applicationsReceived: number;
  upcomingMeetings: number;
}
export interface AdminNotification {
  id: number;
  message: string;
  createdAt: string;
  link: string;
}


export type UserRole = 'ADMIN' | 'EMPLOYEE';
export type EmployeePosition = 'WEB' | 'MOBILE' | 'AI' | 'HR' | 'TREASURER' | 'IOT';
export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface LeaveItem {
  id: number;
  type: string;
  startDate: string;
  endDate: string;
  status: LeaveStatus;
  reason: string | null;
  adminComment?: string | null;
  createdAt: string;
  employee: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface LeaveDetails extends LeaveItem {
  days: number;
}
export interface EmployeeItem {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole; 
  isActive: boolean;
  mustChangePassword: boolean;
  position: EmployeePosition | null;
  personalEmail: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmployeeDto {
  firstName: string;
  lastName: string;
  position: EmployeePosition;
  personalEmail: string;
}

export interface CreateEmployeeResponse {
  message: string;
  id: number;
  companyEmail: string;
}

export interface DisableEmployeeDto {
  reason: string;
}


@Injectable({ providedIn: 'root' })
export class AdminApiService {
  private base = `${environment.apiUrl}/admin`;
  private base_leave = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}


  getDashboard() {
    return this.http.get<AdminDashboardStats>(`${this.base}/dashboard`);
  }

  listEmployees(params?: { q?: string; position?: EmployeePosition | string }) {
    return this.http.get<EmployeeItem[]>(`${this.base}/employees`, {
      params: (params as any) ?? {},
    });
  }

  getEmployee(id: number) {
    return this.http.get<EmployeeItem>(`${this.base}/employees/${id}`);
  }

  createEmployee(dto: CreateEmployeeDto) {
    return this.http.post<CreateEmployeeResponse>(`${this.base}/employees`, dto);
  }

  enableEmployee(id: number) {
    return this.http.patch<{ message: string; id: number }>(
      `${this.base}/employees/${id}/enable`,
      {}
    );
  }

  disableEmployee(id: number, reason: string) {
    const body: DisableEmployeeDto = { reason };
    return this.http.patch<{ message: string; id: number }>(
      `${this.base}/employees/${id}/disable`,
      body
    );
  }
  listLeavesByStatus(status: LeaveStatus) {
  return this.http.get<LeaveItem[]>(`${this.base_leave}/leaves/admin`, {
    params: { status },
  });
}
getLeave(id: number) {
  return this.http.get<LeaveDetails>(`${this.base_leave}/leaves/admin/${id}`);
}
decideLeave(id: number, decision: LeaveStatus, comment?: string) {
  return this.http.patch(
    `${this.base_leave}/leaves/admin/${id}/decision`,
    { decision, comment }
  );


}
getAdminNotifications() {
  return this.http.get<any[]>(`${this.base_leave}/leaves/admin`, {
    params: { status: 'PENDING' },
  });
}


}
