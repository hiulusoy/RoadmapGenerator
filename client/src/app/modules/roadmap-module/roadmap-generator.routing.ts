import { Routes } from '@angular/router';
import { RoadmapGeneratorComponent } from './roadmap-generator/roadmap-generator.component';
import { RoadmapListComponent } from './roadmap-list/roadmap-list.component';

export const RoadmapGeneratorRoutes: Routes = [
  {
    path: '', // Ana yolu boş string olarak ayarlayın
    children: [
      {
        path: 'generate',
        component: RoadmapGeneratorComponent,
      },
      {
        path: 'list',
        component: RoadmapListComponent, // route
      },
    ],
  },
];
