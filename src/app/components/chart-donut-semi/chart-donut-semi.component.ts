import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import {
  ApexChart,
  ApexFill,
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexLegend,
  ApexDataLabels,
  ApexResponsive,
  ApexStroke,
  ApexTooltip,
  NgApexchartsModule
} from 'ng-apexcharts';

@Component({
  selector: 'chart-donut-semi',
  imports: [
    NgApexchartsModule,
    MatCardModule
  ],
  templateUrl: './chart-donut-semi.component.html',
  styleUrl: './chart-donut-semi.component.scss'
})
export class ChartDonutSemiComponent implements OnChanges {
  @Input() totalValue = 100;
  @Input() currentValue = 35;
  @Input() title = 'Tesst';
  @Input() height: number = 0;

  get percentage(): number {
    return Math.round((this.currentValue / this.totalValue) * 100);
  }

  chartSeries = [this.currentValue, this.totalValue - this.currentValue];

  chartDetails = {
    type: 'donut',
    height: this.height,
    // height: '100%',
    animations: {
      enabled: true,
    },
    sparkline: {
      enabled: false // removes extra padding
    },
  };

  labels = ['Progress', 'Remaining'];

  colors = ['#F27079', '#192A64'];

  plotOptions = {
    pie: {
      startAngle: -90,
      endAngle: 90,
      donut: {
        size: '70%',
        labels: {
          show: false,
        }
      },
    }
  };

  fill = {
    type: 'solid'
  };

  stroke = {
    width: 0
  };

  dataLabels = {
    enabled: false
  };

  legend = {
    show: false
  };

  tooltip = {
    enabled: true,
    theme: 'light'
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['totalValue']) {
      this.chartSeries = [this.currentValue, this.totalValue - this.currentValue];
    }
  }
}