import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import 'iconify-icon';
import 'simplebar'; // or "import SimpleBar from 'simplebar';" if you want to use it manually.
import { LayoutComponent } from "./layout/layout/layout.component";
import { SidebarComponent } from "./layout/layout/sidebar/sidebar.component";
import { TopbarComponent } from "./layout/layout/topbar/topbar.component";
import { FooterComponent } from "./layout/layout/footer/footer.component";
import { RouterModule } from "@angular/router";
import { DashboardComponent } from "./components/dashboard/dashboard/dashboard.component";
import { ChartComponent } from "ng-apexcharts";

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    SidebarComponent,
    TopbarComponent,
    FooterComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    ChartComponent
  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule {
}
