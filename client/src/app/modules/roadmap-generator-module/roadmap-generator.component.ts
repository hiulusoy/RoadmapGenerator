import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-roadmap-generator',
  templateUrl: './roadmap-generator.component.html',
  styleUrl: './roadmap-generator.component.css'
})
export class RoadmapGeneratorComponent implements OnInit {
  
  learningPlanForm: FormGroup;
  currentStep: number = 1;
  formSubmitted: boolean = false;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.learningPlanForm = this.fb.group({
      topic: ['', Validators.required],
      level: ['', Validators.required],
      learningStyle: ['', Validators.required],
      timeFrame: ['', Validators.required],
      scheduleType: ['', Validators.required],
    });
  }

  ngOnInit() {
    // Log form values whenever any field changes
  }

  nextStep() {
    const controlName = this.getControlName(this.currentStep);
    const control = this.learningPlanForm.get(controlName);

    if (control && control.valid) {
      console.log(`${controlName} value:`, control.value); // Log the value of the current control
      this.currentStep++;
    } else {
      console.warn(`${controlName} is invalid or empty`);
    }
  }

  submitForm() {
    if (this.learningPlanForm.valid) {
      console.log(this.learningPlanForm.getRawValue());
      
      // TODO: import service and call the endpoint here
      // this.http.post(this.apiUrl, this.learningPlanForm.value).subscribe(
      //   response => {
      //     this.formSubmitted = true;
      //     console.log('Form submitted successfully:', response);
      //   },
      //   error => {
      //     console.error('Error submitting form:', error);
      //   }
      // );
    }
  }

  getControlName(step: number): string {
    switch (step) {
      case 1: return 'topic';
      case 2: return 'level';
      case 3: return 'learningStyle';
      case 4: return 'timeFrame';
      case 5: return 'scheduleType';
      default: return '';
    }
  }
}
