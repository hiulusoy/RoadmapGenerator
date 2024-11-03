import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RoadmapService } from '../service/roadmap.service';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environement';

@Component({
  selector: 'app-roadmap-generator',
  templateUrl: './roadmap-generator.component.html',
  styleUrls: ['./roadmap-generator.component.css'],
})
export class RoadmapGeneratorComponent implements OnInit {
  learningPlanForm: FormGroup;
  currentStep: number = 1;
  formSubmitted: boolean = false;
  loading: boolean = false;
  messageDisplayed: boolean = false;

  constructor(private fb: FormBuilder, private roadmapService: RoadmapService, private router: Router) {
    this.learningPlanForm = this.fb.group({
      topic: ['', Validators.required],
      level: ['', Validators.required],
      learning_style: ['', Validators.required],
    });
  }

  ngOnInit() {}

  nextStep() {
    const controlName = this.getControlName(this.currentStep);
    const control = this.learningPlanForm.get(controlName);

    if (control && control.valid) {
      console.log(`${controlName} value:`, control.value);
      this.currentStep++;
    } else {
      console.warn(`${controlName} is invalid or empty`);
    }
  }

  submitForm() {
    if (this.learningPlanForm.valid) {
      console.log('Form Data:', this.learningPlanForm.value);

      // Move to Step 4 (Loading)
      this.currentStep = 4;

      this.roadmapService.createRoadmap(this.learningPlanForm.value).subscribe(
        (response) => {
          console.log('Roadmap creation response:', response);

          // Navigate to `inspectRoadmap` with the newly created roadmap ID
          this.router.navigate([`${environment.ROUTE_ROADMAP}/inspect`, response.id]);
        },
        (error) => {
          console.error('Error creating roadmap:', error);

          // Revert to form steps if there's an error
          this.currentStep = 3;
        }
      );
    } else {
      this.learningPlanForm.markAllAsTouched(); // Highlight invalid fields
    }
  }

  getControlName(step: number): string {
    switch (step) {
      case 1:
        return 'topic';
      case 2:
        return 'level';
      case 3:
        return 'learning_style';
      case 4:
        return 'loading';
      default:
        return '';
    }
  }
}
