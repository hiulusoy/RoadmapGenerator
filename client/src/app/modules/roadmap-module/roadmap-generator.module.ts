import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoadmapGeneratorRoutes } from './roadmap-generator.routing';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RoadmapGeneratorComponent } from './roadmap-generator/roadmap-generator.component';
import { RoadmapListComponent } from './roadmap-list/roadmap-list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [RoadmapGeneratorComponent, RoadmapListComponent],
  imports: [SharedModule, RouterModule.forChild(RoadmapGeneratorRoutes)],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RoadmapGeneratorModule {}
