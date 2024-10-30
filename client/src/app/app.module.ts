import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import 'iconify-icon';
import 'simplebar'; // or "import SimpleBar from 'simplebar';" if you want to use it manually.
import { SidebarComponent } from "./layouts/admin/sidebar/sidebar.component";
import { TopbarComponent } from "./layouts/admin/topbar/topbar.component";
import { FooterComponent } from "./layouts/admin/footer/footer.component";
import { RouterModule } from "@angular/router";
import { DashboardComponent } from "./components/dashboard/dashboard/dashboard.component";
import { ChartComponent } from "ng-apexcharts";
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';
import { AuthService } from './modules/authentication-module/services/auth.service';
import { LoadingService } from '../shared/services/loading.service';
import { HttpClientModule } from '@angular/common/http';
import { UserLayoutComponent } from './layouts/user/user-layout/user-layout.component';
import { AdminLayoutComponent } from './layouts/admin/admin-layout/admin-layout.component';
import { RoadmapGeneratorComponent } from './modules/roadmap-generator-module/roadmap-generator.component';
import { RoadmapGeneratorModule } from './modules/roadmap-generator-module/roadmap-generator.module';

@NgModule({
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    SidebarComponent,
    TopbarComponent,
    FooterComponent,
    DashboardComponent,
    AuthLayoutComponent,
    UserLayoutComponent,
    AdminLayoutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    ChartComponent,
    HttpClientModule
  ],
  providers: [
    AuthService, 
    LoadingService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule {
}
