import { Component, Input, input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexXAxis,
  ApexPlotOptions,
  ApexStroke,
  ApexTitleSubtitle,
  ApexYAxis,
  ApexTooltip,
  ApexFill,
  ApexLegend,
  NgApexchartsModule
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  tooltip: ApexTooltip;
  fill: ApexFill;
  legend: ApexLegend;
};

@Component({
  selector: 'chart-bar-stacked',
  imports: [
    NgApexchartsModule,
    MatCardModule
  ],
  templateUrl: './chart-bar-stacked.component.html',
  styleUrl: './chart-bar-stacked.component.scss'
})
export class ChartBarStackedComponent implements OnInit, OnChanges {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  @Input() title: string;
  @Input() categories: string;
  @Input() series: any[];

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

  constructor(
  ) {

  }

  ngOnInit(): void {
    // this.loadChart();
  }

  loadChart() {

    this.chartOptions = {
      series: this.series,
      chart: {
        type: "bar",
        height: 350,
        stacked: true,
      },
      plotOptions: {
        bar: {
          horizontal: true
        }
      },
      stroke: {
        width: 1,
        colors: ["#fff"]
      },
      title: {
        text: this.title
      },
      xaxis: {
        categories: this.categories,//
        labels: {
          formatter: function (val) {
            return val + "K";
          }
        }
      },
      yaxis: {
        title: {
          text: undefined
        }
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val + "K";
          }
        }
      },
      fill: {
        opacity: 1
      },
      legend: {
        position: "top",
        horizontalAlign: "left",
        offsetX: 40
      }
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['series']) {
      this.loadChart();
    }
  }
}
