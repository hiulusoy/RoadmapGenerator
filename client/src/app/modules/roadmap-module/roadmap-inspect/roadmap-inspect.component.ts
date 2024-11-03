import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RoadmapService } from '../service/roadmap.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../environments/environement';

@Component({
  selector: 'app-roadmap-inspect',
  templateUrl: './roadmap-inspect.component.html',
  styleUrls: ['./roadmap-inspect.component.css'],
})
export class RoadmapInspectComponent implements OnInit {
  learningPlanForm: FormGroup;
  currentStep: number = 1;
  formSubmitted: boolean = false;
  loading: boolean = false;
  messageDisplayed: boolean = false;
  currentRoadmapId: any;

  constructor(private fb: FormBuilder, private roadmapService: RoadmapService, private router: Router, private route: ActivatedRoute) {
    this.route.params.subscribe((params) => {
      if (!params['id']) return;
      this.currentRoadmapId = params['id'];
    });
  }

  ngOnInit() {}
}
