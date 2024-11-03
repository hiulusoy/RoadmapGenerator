import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexFill, ApexGrid, ApexLegend, ApexPlotOptions, ApexResponsive, ApexStroke, ApexTooltip, ApexXAxis, ApexYAxis } from 'ng-apexcharts';
import { Subscription } from 'rxjs';
import { ThemeService } from '../../../components/theme.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels?: ApexDataLabels;
  plotOptions?: ApexPlotOptions;
  yaxis?: ApexYAxis;
  xaxis?: ApexXAxis;
  stroke?: ApexStroke;
  tooltip?: ApexTooltip;
  fill?: ApexFill;
  legend?: ApexLegend;
  grid?: ApexGrid;
  responsive?: ApexResponsive[];
  colors?: string[];
};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit, OnDestroy {
  public revenueChartOptions: Partial<ChartOptions> | any;
  public customerChartOptions: Partial<ChartOptions> | any;
  public topCountriesChartOptions: Partial<ChartOptions> | any;

  private themeSubscription: Subscription;

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.initRevenueStatisticsChart();
    this.initCustomerAcquisitionChart();
    this.initTopCountriesChart();

    // // Tema değişikliklerini dinleme
    // this.themeSubscription = this.themeService.currentTheme.subscribe((theme) => {
    //   this.updateChartsTheme(theme);
    // });
  }

  ngOnDestroy(): void {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }

  initRevenueStatisticsChart() {
    this.revenueChartOptions = {
      series: [
        {
          name: 'Orders',
          data: [10, 12, 14, 16, 18, 20, 14, 16, 18, 12],
        },
        {
          name: 'Revenue',
          data: [15, 24, 21, 28, 30, 40, 22, 32, 34, 20],
        },
      ],
      chart: {
        type: 'bar',
        height: 280,
        stacked: true,
        background: 'transparent',
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          borderRadius: 8,
          horizontal: false,
          columnWidth: '50%',
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: ['2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'],
      },
      colors: ['#3e60d5', '#3ed5b9'],
      legend: {
        position: 'bottom',
        horizontalAlign: 'center',
      },
    };
  }

  initCustomerAcquisitionChart() {
    this.customerChartOptions = {
      series: [
        {
          name: 'Sessions',
          data: [10, 14, 16, 14, 12, 15, 18, 21, 24, 23, 21, 17, 19, 22],
        },
      ],
      chart: {
        type: 'area',
        height: 210,
        sparkline: {
          enabled: true,
        },
        background: 'transparent',
        toolbar: {
          show: false,
        },
      },
      stroke: {
        curve: 'smooth',
        width: 2,
      },
      dataLabels: {
        enabled: false,
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.5,
          opacityTo: 0,
          stops: [0, 90, 100],
        },
      },
      colors: ['#4b86ff'],
    };
  }

  initTopCountriesChart() {
    this.topCountriesChartOptions = {
      series: [
        {
          data: [10, 15, 14, 18, 25, 16],
        },
      ],
      chart: {
        type: 'bar',
        height: 290,
        background: 'transparent',
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: true,
          borderRadius: 4,
          distributed: true,
        },
      },
      dataLabels: {
        enabled: true,
        textAnchor: 'start',
        style: {
          colors: ['#fff'],
        },
        formatter: function (val: number, opt: any) {
          return opt.w.globals.labels[opt.dataPointIndex] + ':  ' + val + '%';
        },
        offsetX: -10,
      },
      xaxis: {
        categories: ['Turkey', 'Canada', 'India', 'Netherlands', 'Italy', 'France'],
      },
      colors: ['#3e60d5', '#47ad77', '#fa5c7c', '#6c757d', '#39afd1', '#2b908f'],
      legend: {
        show: false,
      },
    };
  }

  updateChartsTheme(theme: string) {
    // Gelir İstatistikleri Grafiği
    this.revenueChartOptions.chart.theme = { mode: theme };
    this.revenueChartOptions = { ...this.revenueChartOptions };

    // Müşteri Kazanımı Grafiği
    this.customerChartOptions.chart.theme = { mode: theme };
    this.customerChartOptions = { ...this.customerChartOptions };

    // En İyi Ülkeler Grafiği
    this.topCountriesChartOptions.chart.theme = { mode: theme };
    this.topCountriesChartOptions = { ...this.topCountriesChartOptions };
  }
}
