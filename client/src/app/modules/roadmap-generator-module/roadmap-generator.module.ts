import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoadmapGeneratorRoutes } from './roadmap-generator.routing';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RoadmapGeneratorComponent } from './roadmap-generator.component';



@NgModule({
  declarations: [RoadmapGeneratorComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(RoadmapGeneratorRoutes),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RoadmapGeneratorModule { }