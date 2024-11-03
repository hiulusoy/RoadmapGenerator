import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { LoadingService } from '../../../shared/services/loading.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css'],
})
export class LoaderComponent implements OnInit {
  isLoading: Observable<boolean>;

  constructor(private loadingService: LoadingService) {
    this.isLoading = this.loadingService.isLoading;
  }

  ngOnInit() {}
}
