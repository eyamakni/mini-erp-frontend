import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class EmployeeApiService {

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Dashboard
  getDashboard(): Observable<any> {
    return this.http.get(`${this.baseUrl}/employee/dashboard`);
  }

  // Leaves
  requestLeave(dto: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/leaves`, dto);
  }

  getMyLeaves(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/leaves/mine`);
  }

  // Meetings
  getMyMeetings(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/meetings/mine`);
  }

  cancelMeeting(id: number): Observable<any> {
    return this.http.patch(
      `${this.baseUrl}/meetings/mine/${id}/cancel`,
      {}
    );
  }
    
  logout(): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/logout`, {});
  }
  getEmployees(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/employee/employees`);
  }

  createMeeting(dto: {
    title: string;
    description?: string;
    startAt: string;          
    durationMinutes: number;  
    participantIds: number[];
  }): Observable<any> {
    return this.http.post(`${this.baseUrl}/meetings`, dto);
  }


}
