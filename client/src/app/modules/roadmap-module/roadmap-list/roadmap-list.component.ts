import { Component } from '@angular/core';
import { Roadmap } from '../model/model';
import { RoadmapService } from '../service/roadmap.service';

@Component({
  selector: 'app-roadmap-list',
  templateUrl: './roadmap-list.component.html',
  styleUrl: './roadmap-list.component.css',
})
export class RoadmapListComponent {
  roadmaps: Roadmap[] = [];

  constructor(private roadmapService: RoadmapService) {}

  ngOnInit(): void {
    this.getRoadmaps();
  }

  getRoadmaps(): void {
    this.roadmapService.getRoadmaps().subscribe(
      (data: Roadmap[]) => {
        this.roadmaps = data;
      },
      (error) => {
        console.error('Roadmap verileri alınırken hata oluştu', error);
      }
    );
  }

  editRoadmap(roadmap: Roadmap): void {
    // Düzenleme fonksiyonunu burada uygulayın
  }

  viewRoadmap(roadmap: Roadmap): void {
    // Görüntüleme fonksiyonunu burada uygulayın
  }

  confirmDelete(roadmap: Roadmap): void {
    // Silme onay modali açma fonksiyonunu burada uygulayın
  }
}
