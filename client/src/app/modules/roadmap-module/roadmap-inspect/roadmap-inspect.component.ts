import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RoadmapService } from '../service/roadmap.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../environments/environement';

@Component({
  selector: 'app-roadmap-inspect',
  templateUrl: './roadmap-inspect.component.html',
  styleUrls: ['./roadmap-inspect.component.css'],
})
export class RoadmapInspectComponent implements OnInit {
  roadmap: any = {}; // Initialize roadmap to an empty object
  selectedWeek: any = null; // Initialize selected week to null

  constructor(private roadmapService: RoadmapService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const roadmapId = this.route.snapshot.paramMap.get('id');
    if (roadmapId) {
      this.fetchRoadmapById(roadmapId);
    }
  }

  fetchRoadmapById(id: string): void {
    this.roadmapService.getById(id).subscribe(
      (response) => {
        if (response && response.weeklySchedule) {
          this.roadmap = response; // Set roadmap to the fetched data
          this.selectedWeek = null; // Reset selected week
        } else {
          console.error('No valid roadmap data found in response.');
        }
      },
      (error) => {
        console.error('Failed to fetch roadmap data:', error);
      }
    );
  }

  selectWeek(weekKey: string): void {
    if (this.roadmap && this.roadmap.weeklySchedule && this.roadmap.weeklySchedule[weekKey]) {
      this.selectedWeek = this.roadmap.weeklySchedule[weekKey];
    }
  }

  getWeekKeys(): string[] {
    return this.roadmap && this.roadmap.weeklySchedule ? Object.keys(this.roadmap.weeklySchedule) : [];
  }
}
