import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingComponent } from './landing.component';
import { RouterModule } from '@angular/router';
import { LandingRoutes } from './landing.routing';



@NgModule({
  declarations: [
    LandingComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(LandingRoutes),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LandingModule { }
