import { Component, OnInit } from '@angular/core';
import { AdminLayoutService } from './admin-layout.service';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent implements OnInit {
  constructor(private adminLayoutService: AdminLayoutService) {
  }


  ngOnInit(): void {
    // Servisi çağırarak temayı ve düzeni başlatın.
    this.adminLayoutService.init();

    // Örnek olarak temayı güncellemek için `updateTheme` metodunu çağırabilirsiniz:
    this.adminLayoutService.updateTheme();
  }
}
