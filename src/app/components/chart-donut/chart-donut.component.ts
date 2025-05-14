import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, input, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { ChartComponent, NgApexchartsModule } from "ng-apexcharts";
import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ApexLegend,
  ApexTitleSubtitle
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  legend: ApexLegend;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'chart-donut',
  imports: [
    CommonModule,
    NgApexchartsModule,
    MatCardModule
  ],
  templateUrl: './chart-donut.component.html',
  styleUrl: './chart-donut.component.scss'
})
export class ChartDonutComponent implements AfterViewInit, OnChanges {
  @Input() labels: any;
  @Input() series: any;
  @Input() height: number = 0;
  @Input() title: string;
  @Input() labelSeries: string;
  @Input() labelValues: string;

  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  colors = [
    '#F27079', // Base warm
    '#192A64', // Base cool
    '#F5868D', // Lighter warm
    '#2C3B78', // Lighter cool
    '#F79BA2', // Even lighter warm
    '#3F4C8C', // Even lighter cool
    '#FCBEC2', // Pastel warm
    '#5260A0', // Soft cool
    '#DE5F6A', // Deeper warm
    '#6471B4', // Soft bold cool
    '#C44E5A', // Rich warm
    '#7783C9', // Bright cool
    '#A53D49', // Darker warm
    '#8A95DD', // Brighter cool
    '#872C38', // Deep warm
    '#9DA8F1', // Light vivid cool
  ];

  constructor() {
    this.chartOptions = {
      series: [44, 55, 13, 43, 22],
      chart: {
        type: "donut"
      },
      labels: ["Team A", "Team B", "Team C", "Team D", "Team E"],
      legend: {
        show: false,
        position: 'bottom'
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
  }

  ngAfterViewInit(): void {
    // this.loadData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['series']) {
      this.loadData();
    }
  }

  loadData() {
    if (this.labels) {
      if (this.labels.length > 0) {
        setTimeout(() => {
          this.chartOptions = {
            title: {
              text: this.title
            },
            series: this.series,
            chart: {
              type: "donut",
              height: this.height - 32,
            },
            labels: this.labels,
            legend: {
              position: 'bottom'
            },
            responsive: [
              {
                breakpoint: 480,
                options: {
                  chart: {
                    width: 200
                  },
                  legend: {
                    position: "bottom"
                  }
                }
              }
            ]
          };
        }, 100);
      }
    }
  }
}
