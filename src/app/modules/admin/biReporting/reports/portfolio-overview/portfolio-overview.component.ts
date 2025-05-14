import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, ViewChild, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
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
  selector: 'portfolio-overview',
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    ChartColumnLineComponent,
    TableDynamicComponent,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './portfolio-overview.component.html',
  styleUrl: './portfolio-overview.component.scss'
})
export class PortfolioOverviewComponent implements AfterViewInit, OnInit {
  @ViewChild('pageContainer1') pageContainer1!: ElementRef<HTMLDivElement>;
  @ViewChild('pageContainer2') pageContainer2!: ElementRef<HTMLDivElement>;
  totalHeight1: number;
  totalHeight2: number;

  loading: boolean = false;

  data: any;
  dataFiltered: any;

  labelColumnsAgeDistribution: any = "Total Debtors";
  labelLineAgeDistribution: any = "Yield %";
  seriesColumnAgeDistribution: any;
  seriesLineAgeDistribution: any;
  labelsAgeDistribution: any;
  titleAgeDistribution: string = 'Age Distribution';

  labelColumnsGenderDistribution: any = "Total Debtors";
  labelLineGenderDistribution: any = "Yield %";
  seriesColumnGenderDistribution: any;
  seriesLineGenderDistribution: any;
  labelsGenderDistribution: any;
  titleGenderDistribution: string = 'Gender Distribution';

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
    this.selectPage('Portfolio Overview');
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
          console.log(data);
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
    const ageGroupMap = new Map<string, { count: number; yieldCount: number }>();

    for (const item of this.data) {
      const group = item.ageGroup;
      const successMetric =
        Number(item.successfulCalls || 0) +
        Number(item.email || 0) +
        Number(item.smssSent || 0);

      if (!ageGroupMap.has(group)) {
        ageGroupMap.set(group, { count: 0, yieldCount: 0 });
      }

      const groupData = ageGroupMap.get(group)!;
      groupData.count += 1;
      groupData.yieldCount += successMetric;
    }

    // Prepare chart data
    this.labelsAgeDistribution = [];
    this.seriesColumnAgeDistribution = [];
    this.seriesLineAgeDistribution = [];

    ageGroupMap.forEach((value, key) => {
      this.labelsAgeDistribution.push(key);
      this.seriesColumnAgeDistribution.push(value.count);
      const yieldPercentage = (value.yieldCount / value.count) * 100;
      this.seriesLineAgeDistribution.push(+yieldPercentage.toFixed(2));
    });





    const genderMap = new Map<string, { count: number; yieldCount: number }>();

    for (const item of this.data) {
      const group = item.gender;
      const successMetric =
        Number(item.successfulCalls || 0) +
        Number(item.email || 0) +
        Number(item.smssSent || 0);

      if (!genderMap.has(group)) {
        genderMap.set(group, { count: 0, yieldCount: 0 });
      }

      const groupData = genderMap.get(group)!;
      groupData.count += 1;
      groupData.yieldCount += successMetric;
    }

    // Prepare chart data
    this.labelsGenderDistribution = [];
    this.seriesColumnGenderDistribution = [];
    this.seriesLineGenderDistribution = [];

    genderMap.forEach((value, key) => {
      this.labelsGenderDistribution.push(key);
      this.seriesColumnGenderDistribution.push(value.count);
      const yieldPercentage = (value.yieldCount / value.count) * 100;
      this.seriesLineGenderDistribution.push(+yieldPercentage.toFixed(2));
    });
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
