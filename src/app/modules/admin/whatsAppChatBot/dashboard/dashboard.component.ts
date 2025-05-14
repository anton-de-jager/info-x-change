import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { ChartColumnComponent } from 'app/components/chart-column/chart-column.component';
import { ChartDonutSemiComponent } from 'app/components/chart-donut-semi/chart-donut-semi.component';
import { ChartDonutComponent } from 'app/components/chart-donut/chart-donut.component';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { SqlService } from 'app/services/sql.service';
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
import { Subject, takeUntil } from 'rxjs';

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
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    NgApexchartsModule,
    ChartColumnComponent,
    // ChartDonutSemiComponent,
    // ChartDonutComponent,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatCardModule
  ],
})
export class DashboardComponent implements OnInit, OnDestroy {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  chartData = [
    { label: '2024/01/01', value: 44 },
    { label: '2024/01/02', value: 64 },
    { label: '2024/01/03', value: 21 },
    { label: '2024/01/04', value: 58 },
    { label: '2024/01/05', value: 35 }
  ];
  chartTitle = 'Test Chart';
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  data: any[] = [];
  dataMessages: any[] = [];
  dataUsers: any[] = [];
  dataArrangements: any[] = [];
  loading: boolean = false;
  user: User;
  interval: string = 'today';

  constructor(
    private _router: Router,
    private sqlService: SqlService,
    private userService: UserService
  ) {
    this.selectPage('Dashboard');
    this.userService.user$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((user: User) => {
        this.user = user;
        this.loadData();
      });
  }

  selectPage(page: string): void {
    this._router.navigate([], {
      queryParams: { page },
      queryParamsHandling: 'merge', // Preserve existing query params
    });
  }

  loadData(): void {
    let iLoad = 0;
    this.loading = true;
    this.sqlService.getDashboardWhatsApp(this.user['company_Id'], this.interval).subscribe((data) => {
      iLoad++;
      this.data = data[0];
      if (iLoad >= 4) {
        this.loading = false;
      }
    });
    this.sqlService.getDashboardMessages(this.user['company_Id'], this.interval).subscribe((dataMessages) => {
      iLoad++;
      this.dataMessages = dataMessages;
      if (iLoad >= 4) {
        this.loading = false;
      }
    });
    this.sqlService.getDashboardUsers(this.user['company_Id'], this.interval).subscribe((dataUsers) => {
      iLoad++;
      this.dataUsers = dataUsers;
      if (iLoad >= 4) {
        this.loading = false;
      }
    });
    this.sqlService.getDashboardArrangements(this.user['company_Id'], this.interval).subscribe((dataArrangements) => {
      iLoad++;
      this.dataArrangements = dataArrangements;
      if (iLoad >= 4) {
        this.loading = false;
      }
    });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
  }

  updateInterval(interval: string): void {
    this.interval = interval;
    this.loadData();
  }
}
