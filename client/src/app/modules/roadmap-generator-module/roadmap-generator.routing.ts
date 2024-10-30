import { Routes } from '@angular/router';
import { RoadmapGeneratorComponent } from './roadmap-generator.component';

export const RoadmapGeneratorRoutes: Routes = [
  {
    path: '', // Ana yolu boş string olarak ayarlayın
    children: [
      {
        path: '',
        component: RoadmapGeneratorComponent
      }    
    ]
  }
];
