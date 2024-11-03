import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Roadmap } from '../model/model';
import { BaseService } from '../../../../shared/services/base.service';

@Injectable({
  providedIn: 'root',
})
export class RoadmapService extends BaseService {
  constructor(private http: HttpClient) {
    super(http);
  }

  getRoadmaps(): Observable<Roadmap[]> {
    return this.get<Roadmap[]>('/roadmap');
  }

  getRoadmapById(id: any): Observable<Roadmap[]> {
    return this.get<Roadmap[]>(`/roadmap/${id}`);
  }

  createRoadmap(roadmapData: any): Observable<any> {
    return this.post<any, any>('/roadmap', roadmapData);
  }
}