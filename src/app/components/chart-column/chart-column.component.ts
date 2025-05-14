import { Component, Input, input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexAnnotations,
  ApexFill,
  ApexStroke,
  ApexGrid,
  NgApexchartsModule
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: any; //ApexXAxis;
  annotations: ApexAnnotations;
  fill: ApexFill;
  stroke: ApexStroke;
  grid: ApexGrid;
};

@Component({
  selector: 'chart-column',
  imports: [
    NgApexchartsModule,
    MatCardModule
  ],
  templateUrl: './chart-column.component.html',
  styleUrl: './chart-column.component.scss'
})
export class ChartColumnComponent implements OnInit, OnChanges {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  @Input() data: any;
  @Input() title: string;
  @Input() labelSeries: string;
  @Input() labelValues: string;

  constructor(
  ) {

  }

  ngOnInit(): void {
    // this.loadChart();
  }

  loadChart() {
  const colorShades = [
    '#F27079', // base
    '#F5868D',
    '#F79BA2',
    '#FAB1B6',
    '#FCBEC2',
    '#DE5F6A',
    '#C44E5A',
    '#A53D49',
    '#872C38',
    '#6A1C28'
  ];

    this.chartOptions = {
      series: [
        {
          name: this.labelSeries,//"Quantity",
          data: this.data.map(item => item.value)// [44, 55, 41, 67, 22, 43, 21, 33, 45, 31, 87, 65, 35]
        }
      ],
      annotations: {
        points: [
          {
            x: this.labelValues,//"Messages",
            seriesIndex: 0,
            label: {
              borderColor: "#192A64",
              offsetY: 0,
              style: {
                color: "#fff",
                background: "#F27079"
              },
              text: this.labelValues//"Quantity Messages"
            }
          }
        ]
      },
      chart: {
        height: 350,
        width: '100%',
        type: "bar"
      },
      plotOptions: {
        bar: {
          columnWidth: "50%",
          borderRadius: 10
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: 2
      },

      grid: {
        row: {
          colors: ["#fff", "#f2f2f2"]
        }
      },
      xaxis: {
        labels: {
          rotate: -45
        },
        categories: this.data.map(item => item.label),
        tickPlacement: "on"
      },
      yaxis: {
        title: {
          text: this.labelValues//"Quantity"
        }
      },
      fill: {
        colors: colorShades,//["#F27079", "#FF9472", "#FBB034", "#FBB034"],
        type: "gradient",
        gradient: {
          shade: "light",
          type: "horizontal",
          shadeIntensity: 0.25,
          gradientToColors: undefined,
          inverseColors: true,
          opacityFrom: 0.85,
          opacityTo: 0.85,
          stops: [50, 0, 100]
        }
      }
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.loadChart();
    }
  }
}
