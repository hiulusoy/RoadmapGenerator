import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import 'iconify-icon';
import { LayoutService } from "../layout.service";

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
  encapsulation: ViewEncapsulation.None // Bu, component'in global CSS'leri etkilemesini sağlar.


})
export class LayoutComponent implements OnInit {

  constructor(private layoutService: LayoutService) {
  }


  ngOnInit(): void {
    // Servisi çağırarak temayı ve düzeni başlatın.
    this.layoutService.init();

    // Örnek olarak temayı güncellemek için `updateTheme` metodunu çağırabilirsiniz:
    this.layoutService.updateTheme();
  }
}
