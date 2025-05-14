import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, input, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexFill,
  ApexYAxis,
  ApexTooltip,
  ApexTitleSubtitle,
  ApexXAxis,
  NgApexchartsModule
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis | ApexYAxis[];
  title: ApexTitleSubtitle;
  labels: string[];
  stroke: any; // ApexStroke;
  dataLabels: any; // ApexDataLabels;
  fill: ApexFill;
  tooltip: ApexTooltip;
};

@Component({
  selector: 'chart-column-line',
  imports: [
    CommonModule,
    NgApexchartsModule,
    MatCardModule
  ],
  templateUrl: './chart-column-line.component.html',
  styleUrl: './chart-column-line.component.scss'
})
export class ChartColumnLineComponent implements AfterViewInit, OnChanges {
  @Input() labelColumns: any;
  @Input() labelLine: any;
  @Input() seriesColumn: any;
  @Input() seriesLine: any;
  @Input() labels: any;
  @Input() height: number = 0;
  @Input() title: string;

  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  constructor() {
    this.chartOptions = {
      series: [
        {
          name: this.labelColumns,
          type: "column",
          data: [440, 505, 414, 671, 227, 413, 201, 352, 752, 320, 257, 160]
        },
        {
          name: this.labelLine,
          type: "line",
          data: [23, 42, 35, 27, 43, 22, 17, 31, 22, 22, 12, 16]
        }
      ],
      chart: {
        height: 350,
        type: "line",
      },
      stroke: {
        width: [0, 4],
        colors: ["#192A64"]
      },
      title: {
        text: this.title
      },
      fill: {
        colors: ["#F27079"]
      },
      dataLabels: {
        enabled: true,
        enabledOnSeries: [1]
      },
      labels: [
        "01 Jan 2001",
        "02 Jan 2001",
        "03 Jan 2001",
        "04 Jan 2001",
        "05 Jan 2001",
        "06 Jan 2001",
        "07 Jan 2001",
        "08 Jan 2001",
        "09 Jan 2001",
        "10 Jan 2001",
        "11 Jan 2001",
        "12 Jan 2001"
      ],
      xaxis: {
        type: "datetime"
      },
      yaxis: [
        {
          title: {
            text: this.labelColumns
          }
        },
        {
          opposite: true,
          title: {
            text: this.labelLine
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
    if (this.labelColumns) {
      if (this.labelColumns.length > 0) {
        setTimeout(() => {
          this.chartOptions = {
            series: [
              {
                name: this.labelColumns,
                type: "column",
                data: this.seriesColumn
              },
              {
                name: this.labelLine,
                type: "line",
                data: this.seriesLine
              }
            ],
            chart: {
              height: 350,
              type: "line"
            },
            stroke: {
              width: [0, 4]
            },
            title: {
              text: this.title
            },
            dataLabels: {
              enabled: true,
              enabledOnSeries: [1]
            },
            labels: this.labels,
            xaxis: {
              type: "category"
            },
            yaxis: [
              {
                title: {
                  text: this.labelColumns,
                }
              },
              {
                opposite: true,
                title: {
                  text: this.labelLine
                }
              }
            ]
          };
        }, 100);
      }
    }
  }
}
