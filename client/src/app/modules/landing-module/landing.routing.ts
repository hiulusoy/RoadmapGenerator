import { Routes } from '@angular/router';
import { LandingComponent } from './landing.component';

export const LandingRoutes: Routes = [
  {
    path: '', // Ana yolu boş string olarak ayarlayın
    children: [
      {
        path: '',
        component: LandingComponent
      }    
    ]
  }
];
