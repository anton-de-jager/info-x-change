import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, ViewChild, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ChartBarStackedComponent } from 'app/components/chart-bar-stacked/chart-bar-stacked.component';
import { ChartColumnLineComponent } from 'app/components/chart-column-line/chart-column-line.component';
import { ChartDonutComponent } from 'app/components/chart-donut/chart-donut.component';
import { TableDynamicComponent } from 'app/components/table-dynamic/table-dynamic.component';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { DialogFilterComponent } from 'app/dialogs/dialog-filter/dialog-filter.component';
import { FilterItem } from 'app/models/filter.interface';
import { InfoxService } from 'app/services/infox.service';
import { SqlService } from 'app/services/sql.service';
import { Guid } from 'guid-typescript';
import { DateTime } from 'luxon';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'engagement-breakdown',
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    ChartDonutComponent,
    ChartBarStackedComponent,
    TableDynamicComponent,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './engagement-breakdown.component.html',
  styleUrl: './engagement-breakdown.component.scss'
})
export class EngagementBreakdownComponent implements AfterViewInit, OnInit {
  @ViewChild('pageContainer1') pageContainer1!: ElementRef<HTMLDivElement>;
  @ViewChild('pageContainer2') pageContainer2!: ElementRef<HTMLDivElement>;
  totalHeight1: number;
  totalHeight2: number;

  loading: boolean = false;

  data: any;
  dataFiltered: any;

  titleCallsEffifiency: string = 'Calls Effifiency';
  categoriesCallsEffifiency: string[];
  seriesCallsEffifiency: any[];

  titleSmsEffifiency: string = 'SMS Effifiency';
  categoriesSmsEffifiency: string[];
  seriesSmsEffifiency: any[];

  titleEngagementDistribution: string = 'Engagement Distribution';
  seriesEngagementDistribution: any[];
  labelsEngagementDistribution: any[];

  tableAgeDistribution: any;
  columnsAgeDistribution: any;

  tableGenderDistribution: any;
  columnsGenderDistribution: any;

  filter: FilterItem[] = [];

  iLoadData: number = 0;

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _router: Router,
    private infoxService: InfoxService,
    private userService: UserService,
    private sqlService: SqlService,
    @Inject(MatDialog) private dialog: MatDialog
  ) {
    this.selectPage('Engagement Breakdown');
  }

  selectPage(page: string): void {
    this._router.navigate([], {
      queryParams: { page },
      queryParamsHandling: 'merge', // Preserve existing query params
    });
  }

  ngOnInit(): void {
    this.initTableAgeDistribution();
    this.initTableGenderDistribution();
  }

  ngAfterViewInit(): void {
    this.updateHeights();
  }

  @HostListener('window:resize')
  onResize() {
    this.updateHeights();
  }

  updateHeights(): void {
    setTimeout(() => {
      const viewportHeight = window.innerHeight;

      const totalHeight1 = viewportHeight - 72;
      this.totalHeight1 = (totalHeight1 - 72) / 2 - 96;

      const totalHeight2 = viewportHeight - 72;
      this.totalHeight2 = (totalHeight2 - 72) / 2 - 96;
    }, 100);
  }

  initTableAgeDistribution() {
    this.sqlService.getConfigTable(Guid.parse('995ff045-0ece-46b3-b763-28f6002d7a76')).subscribe((table) => {
      this.tableAgeDistribution = table;
      this.sqlService.getConfigColumns(Guid.parse('995ff045-0ece-46b3-b763-28f6002d7a76')).subscribe((columns) => {
        this.columnsAgeDistribution = columns;
        this.infoxService.getData('portfolio-overview').subscribe((data) => {
          setTimeout(() => {
            this.initData(data);
          }, 100);
        });
      });
    });
  }

  initTableGenderDistribution() {
    this.sqlService.getConfigTable(Guid.parse('37ddb0da-c642-4086-bc94-5c5be7bff7f2')).subscribe((table) => {
      this.tableGenderDistribution = table;
      this.sqlService.getConfigColumns(Guid.parse('37ddb0da-c642-4086-bc94-5c5be7bff7f2')).subscribe((columns) => {
        this.columnsGenderDistribution = columns;
      });
    });
  }


  initData(data) {
    this.data = data;
    console.log('data', data);
    this.filter = [];
    this.columnsAgeDistribution.forEach(column => {
      if (column.visibleFilter) {
        this.filter.push({
          property: column.property,
          label: column.label,
          filterType: column.filterType,
          options: [],
          value: null,
          multiple: column.filterType === 'select-multiple',
          placeholder: column.label,
          required: false
        });
      }
    });
    this.initFilter();
  }

  initFilter() {
    this.filter.forEach(f => {
      if (f.filterType === 'select' || f.filterType === 'select-multiple') {
        const uniqueValues = [...new Set(this.data.map(item => item[f.property]))];
        f.options = uniqueValues.map(value => ({
          value: value as string | number,
          label: value as string
        }));
      }
      if (f.filterType === 'month') {
        f.options = [
          { value: 1, label: 'January' },
          { value: 2, label: 'February' },
          { value: 3, label: 'March' },
          { value: 4, label: 'April' },
          { value: 5, label: 'May' },
          { value: 6, label: 'June' },
          { value: 7, label: 'July' },
          { value: 8, label: 'August' },
          { value: 9, label: 'September' },
          { value: 10, label: 'October' },
          { value: 11, label: 'November' },
          { value: 12, label: 'December' }
        ]
      }
    });
    setTimeout(() => {
      this.dataFiltered = [...this.data];
      this.updateChart();
    }, 100);
  }


  applyFilters(data: any[], filterConfig: any[]) {
    const filtered = data.filter(row => {
      return filterConfig.every(f => {
        const { property, filterType, value } = f;

        // Skip if no value is selected
        if (!value || (Array.isArray(value) && value.length === 0)) {
          return true;
        }

        // Handle date range filter
        if (filterType === 'date-range') {
          const date = row[property].split('T')[0];
          const rowDate = DateTime.fromFormat(date, 'yyyy-MM-dd').toMillis();
          const start = value?.start?.toMillis?.();
          const end = value?.end?.toMillis?.();

          return (!start || rowDate >= start) && (!end || rowDate <= end);
        }

        // Handle month (assuming you're comparing numeric months)
        if (property === 'month') {
          const rowDate = DateTime.fromFormat(row[property].split('T')[0], 'yyyy-MM-dd');
          return value.includes(rowDate.month);
        }

        // Handle select filters (with `multiple`)
        if (Array.isArray(value)) {
          return value.includes(row[property]);
        }

        // Fallback for single value
        return row[property] === value;
      });
    });
    this.dataFiltered = filtered;
    this.updateChart();
  }

  updateChart() {
    const normalize = (str: string | null | undefined) => (str || '').trim().toUpperCase();

    // --- SMS Efficiency Aggregation ---
    const smsMap = new Map<string, {
      name: string,
      successful: number,
      undelivered: number,
      failed: number,
      expired: number,
      error: number,
      invalid: number
    }>();

    this.data.forEach(record => {
      const originalClient = record.clientName;
      const normalizedClient = normalize(originalClient);

      if (!smsMap.has(normalizedClient)) {
        smsMap.set(normalizedClient, {
          name: originalClient, // preserve original name
          successful: 0,
          undelivered: 0,
          failed: 0,
          expired: 0,
          error: 0,
          invalid: 0
        });
      }

      const stats = smsMap.get(normalizedClient)!;
      stats.successful += Number(record.smssSent || 0);
      stats.undelivered += Number(record.undeliveredSMSs || 0);
      stats.failed += Number(record.failedSMSs || 0);
      stats.expired += Number(record.expiredSMSs || 0);
      stats.error += Number(record.errorSMSs || 0);
      stats.invalid += Number(record.invalidSMSs || 0);
    });

    this.categoriesSmsEffifiency = Array.from(smsMap.values()).map(v => v.name);

    this.seriesSmsEffifiency = [
      { name: "Successful", data: Array.from(smsMap.values()).map(v => v.successful) },
      { name: "Undelivered", data: Array.from(smsMap.values()).map(v => v.undelivered) },
      { name: "Failed", data: Array.from(smsMap.values()).map(v => v.failed) },
      { name: "Expired", data: Array.from(smsMap.values()).map(v => v.expired) },
      { name: "Error", data: Array.from(smsMap.values()).map(v => v.error) },
      { name: "Invalid", data: Array.from(smsMap.values()).map(v => v.invalid) }
    ];

    // --- Call Efficiency Aggregation ---
    const callMap = new Map<string, {
      name: string,
      successful: number,
      failed: number
    }>();

    this.data.forEach(record => {
      const originalClient = record.clientName;
      const normalizedClient = normalize(originalClient);

      const calls = Number(record.calls || 0);
      const successful = Number(record.successfulCalls || 0);
      const failed = calls - successful;

      if (!callMap.has(normalizedClient)) {
        callMap.set(normalizedClient, { name: originalClient, successful: 0, failed: 0 });
      }

      const stats = callMap.get(normalizedClient)!;
      stats.successful += successful;
      stats.failed += failed;
    });

    this.categoriesCallsEffifiency = Array.from(callMap.values()).map(v => v.name);

    this.seriesCallsEffifiency = [
      { name: "Total Successful Calls", data: Array.from(callMap.values()).map(v => v.successful) },
      { name: "Total Failed Calls", data: Array.from(callMap.values()).map(v => v.failed) }
    ];

    
    
    
    
        let totalSuccessfulCalls = 0;
        let totalSuccessfulSMSs = 0;
        let totalEmails = 0;
    
        this.data.forEach(record => {
          totalSuccessfulCalls += Number(record.successfulCalls || 0);
          totalSuccessfulSMSs += Number(record.smssSent || 0);
          totalEmails += Number(record.eMailSent || record.email || 0); // support both fields
        });
    
        this.seriesEngagementDistribution = [totalSuccessfulCalls, totalSuccessfulSMSs, totalEmails];
        this.labelsEngagementDistribution = ["Total Successful Calls", "Total Successful SMSs", "Total Emails"];

        console.log('seriesEngagementDistribution', this.seriesEngagementDistribution);
  }

  openFilterDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      filter: this.filter,
    };

    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = true;

    const dialogRef = this.dialog.open(
      DialogFilterComponent,
      dialogConfig
    );

    dialogRef
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.filter = result.value;
          this.applyFilters(this.data, this.filter);
        }
      });
  }
}
