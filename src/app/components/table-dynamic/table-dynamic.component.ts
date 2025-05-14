import { Component, ElementRef, Inject, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { DialogFilterComponent } from 'app/dialogs/dialog-filter/dialog-filter.component';
import { FilterItem } from 'app/models/filter.interface';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DateTime } from 'luxon';
import { debounceTime, fromEvent, Subject, takeUntil } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SqlService } from 'app/services/sql.service';
import { Guid } from 'guid-typescript';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { DialogDetailsComponent } from 'app/dialogs/dialog-details/dialog-details.component';
import { InfoxService } from 'app/services/infox.service';

@Component({
  selector: 'table-dynamic',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    ReactiveFormsModule,
    CommonModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatSelectModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatCardModule
  ],
  templateUrl: './table-dynamic.component.html',
  styleUrls: ['./table-dynamic.component.scss'],
})
export class TableDynamicComponent implements OnInit, OnChanges {
  @Input() loadData: boolean = true;
  @Input() table: any;
  @Input() columns: any;
  @Input() data: any[] = [];
  @Input() filter: FilterItem[] = [];
  @Input() tableId: string = '';
  @Input() source: string = '';
  @Input() size: string = 'full';
  @Input() height: number = 0;
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['height']) {
      if (this.loadDone) {
        this.setPaginator();
      }
    }
    if (changes['data']) {
      if (this.data) {
        if (this.data.length > 0) {
          this.initData();
        }
      }
    }
  }

  pageSize: number = 0;
  gap = 0;
  loadDone: boolean = false;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = [];
  iPaginator: number = 0;
  private destroy$ = new Subject<void>();
  loading: boolean = true;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private userService: UserService,
    private sqlService: SqlService,
    private infoxService: InfoxService,
    private router: Router,
    @Inject(MatDialog) private dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.userService.user$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((user: User) => {
        this.sqlService.getConfigTable(Guid.parse(this.tableId)).subscribe((table) => {
          this.table = table;
          if (this.size === 'full') {
            this.selectPage(table.label);
          }
          this.sqlService.getConfigColumns(Guid.parse(this.tableId)).subscribe((columns) => {
            this.columns = columns;
            if (this.loadData) {
              if (this.source === 'sql') {
                this.sqlService.getData(this.table.property, user['company_Id']).subscribe((data) => {
                  this.data = data;
                  this.initData();
                });
              }
              if (this.source === 'infox') {
                this.infoxService.getData(this.table.property).subscribe((data) => {
                  this.data = data;
                  this.initData();
                });
              }
              if (this.source === 'loaded') {
                this.loadTable();
              }
            } else {
              this.initData();
            }
          });
        });
      });
  }

  initData() {
    this.displayedColumns = [];
    this.filter = [];
    if (this.columns) {
      this.columns.forEach(column => {
        if (column.visibleTable) {
          this.displayedColumns.push(column.property);
        }
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
      if (this.table.allowFilter) {
        this.initFilter();
      }
      this.loadTable();
    } else {
      setTimeout(() => {
        this.columns.forEach(column => {
          if (column.visibleTable) {
            this.displayedColumns.push(column.property);
          }
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
        if (this.table.allowFilter) {
          this.initFilter();
        }
        this.loadTable();
      }, 1000);
    }
  }

  selectPage(page: string): void {
    this.router.navigate([], {
      queryParams: { page },
      queryParamsHandling: 'merge', // Preserve existing query params
    });
  }

  initFilter() {
    this.filter.forEach(f => {
      if (f.filterType === 'select' || f.filterType === 'select-multiple') {
        const uniqueValues = [...new Set(this.data.map(item => item[f.property]))];
        f.options = uniqueValues.map(value => ({
          value: value,
          label: value
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
  }

  async loadTable() {
    this.dataSource = new MatTableDataSource(this.data);
    this.iPaginator = 0;
    this.setResizeEvents();
    this.setPaginator();
  }

  setResizeEvents() {
    fromEvent(window, 'resize')
      .pipe(debounceTime(200), takeUntil(this.destroy$))
      .subscribe(() => {
        this.iPaginator = 0;
        this.setPaginator();
      });
  }

  setPaginator() {
    if (this.height > 0) {
      this.gap = (this.height - 56) - (Math.trunc((this.height - 56) / 40) * 40);
      let pageSize = Math.trunc((this.height - 56) / 40) * 40;
      let dataSize = this.dataSource.data.length * 40;
      if (pageSize > dataSize) {
        this.gap = this.gap + (pageSize - dataSize);
      }
      this.pageSize = Math.trunc((this.height - 56) / 40);

      this.iPaginator++;
      if (this.iPaginator < 5) {
        if (this.paginator) {
          this.paginator.pageSize = Math.trunc((this.height - 56) / 40);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          if (this.paginator.pageIndex != 0) {
            if (
              this.paginator.pageIndex + 1 >
              this.paginator.getNumberOfPages()
            ) {
              this.paginator.lastPage();
            }
          }
          this.loading = false;
          this.loadDone = true;
        } else {
          setTimeout(() => {
            this.setPaginator();
          }, 500);
        }
      } else {
        this.loading = false;
        this.loadDone = true;
      }
    } else {

    }
  }

  onPageChange(event: PageEvent): void {
    const pageIndex = event.pageIndex + 1;
    const pageSize = event.pageSize;
    const rows = pageIndex * pageSize;
    const rowsData = this.dataSource.data.length;

    if (rowsData < rows) {
      this.gap = this.gap + ((rows - rowsData) * 40);
    } else {
      this.gap = (this.height - 56) - (Math.trunc((this.height - 56) / 40) * 40);
    }
  }

  applyFilters(data: any[], dataSource: MatTableDataSource<any, MatPaginator>, filterConfig: any[]) {
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

    dataSource.data = filtered;
  }

  openFilterDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      // item: [],
      // form: this.formFilter,
      filter: this.filter,
      // teamNames: [...new Set(this.data.map(item => item.teamName))].map(name => ({ description: name })),
      // agents: [...new Set(this.data.map(item => item.agent))].map(name => ({ description: name })),
      // title: 'Update',
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
          this.applyFilters(this.data, this.dataSource, this.filter);
          setTimeout(() => {
            this.iPaginator = 0;
            this.setPaginator();
          }, 100);
        }
      });
  }

  exportToExcel(): void {
    const worksheet = XLSX.utils.json_to_sheet(this.dataSource.data); // or any data
    const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    FileSaver.saveAs(blob, 'exported-data.xlsx');
  }

  exportToPDF(): void {
    const doc = new jsPDF();

    const columns = Object.keys(this.dataSource.data[0] || {}).map(key => ({ header: key, dataKey: key }));
    const rows = this.dataSource.data;

    autoTable(doc, {
      columns: columns,
      body: rows
    });

    doc.save('exported-data.pdf');
  }

  sortData(event) {
    const { active, direction } = event;
    if (direction === '') {
      this.dataSource.data = this.data;
    }
    else {
      this.dataSource.data = this.data.sort((a, b) => {
        const aValue = a[active];
        const bValue = b[active];

        if (aValue < bValue) {
          return direction === 'asc' ? -1 : 1;
        } else if (aValue > bValue) {
          return direction === 'asc' ? 1 : -1;
        } else {
          return 0;
        }
      });
    }
    this.dataSource._updateChangeSubscription();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    if (this.paginator.pageIndex != 0) {
      if (
        this.paginator.pageIndex + 1 >
        this.paginator.getNumberOfPages()
      ) {
        this.paginator.lastPage();
      }
    }
    if (this.dataSource.paginator) {
      this.dataSource.paginator.pageIndex = 0;
    }
    this.dataSource._updateChangeSubscription();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    if (this.paginator.pageIndex != 0) {
      if (
        this.paginator.pageIndex + 1 >
        this.paginator.getNumberOfPages()
      ) {
        this.paginator.lastPage();
      }
    }
    if (this.dataSource.paginator) {
      this.dataSource.paginator.pageIndex = 0;
    }
    this.dataSource._updateChangeSubscription();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  opedDetails(data: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      data: data,
      columns: this.columns
    }

    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = true;
    dialogConfig.width = '80%';

    const dialogRef = this.dialog.open(
      DialogDetailsComponent,
      dialogConfig
    );
  }
}
