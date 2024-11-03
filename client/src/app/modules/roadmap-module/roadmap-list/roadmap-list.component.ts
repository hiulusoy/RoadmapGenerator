import { Component } from '@angular/core';
import { Roadmap } from '../model/model';
import { RoadmapService } from '../service/roadmap.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-roadmap-list',
  templateUrl: './roadmap-list.component.html',
  styleUrl: './roadmap-list.component.css',
})
export class RoadmapListComponent {
  roadmaps: any[] = [];

  constructor(private roadmapService: RoadmapService, private router: Router) {}

  ngOnInit(): void {
    this.getRoadmaps();
  }

  getRoadmaps(): void {
    this.roadmapService.getRoadmaps().subscribe(
      (response) => {
        // Check if the response has data
        if (response && Array.isArray(response)) {
          this.roadmaps = response.map((roadmap) => {
            const firstWeek = Object.values(roadmap.weeklySchedule.weeks)[0] || {};
            return {
              _id: roadmap._id,
              isPublic: roadmap.isPublic,
              createdByIds: roadmap.createdByIds,
              requestId: roadmap.requestId,
              topic: roadmap.topic,
              level: roadmap.level,
              learning_style: roadmap.learning_style,
            };
          });
          console.log('Normalized Roadmap list:', this.roadmaps);
        } else {
          console.log('No data found in the response');
        }
      },
      (error) => {
        console.error('Error fetching roadmaps:', error);
      }
    );
  }

  editRoadmap(roadmap: any): void {
    // Navigate to the inspect page with the roadmap ID
    this.router.navigate([`/roadmap/inspect`, roadmap._id]);
  }

  viewRoadmap(roadmap: Roadmap): void {
    // Görüntüleme fonksiyonunu burada uygulayın
  }

  confirmDelete(roadmap: Roadmap): void {
    // Silme onay modali açma fonksiyonunu burada uygulayın
  }
}
