import {Component} from '@angular/core';
import 'iconify-icon';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  // leftmenu.component.ts
  menuItems = [
    {label: 'Dashboard', icon: 'lucide:airplay', route: '/dashboard'},
    {label: 'Users', icon: 'lucide:user', route: '/users'},
    {label: 'Tenants', icon: 'lucide:building', route: '/tenants'}
  ];


}
