import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export type JobContractType = 'CDI' | 'CDD' | 'INTERN' | 'FREELANCE';
export type JobOfferStatus = 'OPEN' | 'CLOSED';

export interface JobOffer {
  id: number;
  position: string;
  description: string;
  requiredSkills: string;
  contractType: JobContractType;
  status: JobOfferStatus;
  deadline: string | null;
  createdAt: string;
}

export interface CreateJobOfferDto {
  position: string;
  description: string;
  requiredSkills: string;
  contractType: JobContractType;
  deadline?: string;
}

@Injectable({ providedIn: 'root' })
export class JobsApiService {
  private base = `${environment.apiUrl}/jobs`;

  constructor(private http: HttpClient) {}

 
  listPublic() {
    return this.http.get<JobOffer[]>(this.base);
  }


  create(dto: CreateJobOfferDto) {
    return this.http.post<JobOffer>(this.base, dto);
  }

  close(id: number) {
    return this.http.patch(`${this.base}/${id}/close`, {});
  }
}
