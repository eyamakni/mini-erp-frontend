import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export type ApplicationStatus =
  | 'NEW'
  | 'REVIEWED'
  | 'SHORTLISTED'
  | 'INTERVIEW'
  | 'REJECTED'
  | 'HIRED';

export interface JobApplicationItem {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  status: ApplicationStatus;
  createdAt: string;
  jobOffer: {
    id: number;
    position: string;
  };
}

export interface JobApplicationDetail extends JobApplicationItem {
  message: string | null;
  portfolioLink: string | null;
  cvPath: string;
  adminNotes: string | null;
}

@Injectable({ providedIn: 'root' })
export class ApplicationsApiService {
  private base = `${environment.apiUrl}/applications`;

  constructor(private http: HttpClient) {}

  listAdmin(params?: {
    jobOfferId?: number;
    status?: ApplicationStatus;
    from?: string;
    to?: string;
  }) {
    return this.http.get<JobApplicationItem[]>(
      `${this.base}/admin`,
      { params: params as any }
    );
  }


  getOneAdmin(id: number) {
    return this.http.get<JobApplicationDetail>(
      `${this.base}/admin/${id}`
    );
  }

updateStatus(
  id: number,
  dto: { status: ApplicationStatus; adminNotes?: string }
) {
  return this.http.patch(
    `${this.base}/admin/${id}`,
    dto
  );
}

}
