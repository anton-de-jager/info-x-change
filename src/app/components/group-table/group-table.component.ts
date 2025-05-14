import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';

interface Person {
  name: string;
  age: number;
  country: string;
  department: string;
}

@Component({
  selector: 'table-dynamic-group',
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
  templateUrl: './group-table.component.html',
  styleUrls: ['./group-table.component.scss'],
})
export class GroupTableComponent implements OnInit {
  displayedColumns: string[] = ['name', 'age', 'country', 'department'];
  dataSource = new MatTableDataSource<Person>();

  data: Person[] = [
    { name: 'John', age: 25, country: 'USA', department: 'Sales' },
    { name: 'Jane', age: 30, country: 'USA', department: 'HR' },
    { name: 'Hans', age: 27, country: 'Germany', department: 'Sales' },
    { name: 'Peter', age: 22, country: 'Germany', department: 'HR' },
    { name: 'Maria', age: 29, country: 'Spain', department: 'Sales' },
  ];

  groupByColumns: string[] = [];
  groupedData: any[] = [];
  collapsedGroups = new Set<string>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.dataSource.data = this.data;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.updateGrouping();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
    this.updateGrouping();
  }

  onGroupDrop(event: CdkDragDrop<string[]>) {
    const column = event.item.data;
    if (!this.groupByColumns.includes(column)) {
      this.groupByColumns.push(column);
      this.updateGrouping();
    }
  }

  toggleGroup(key: string) {
    this.collapsedGroups.has(key)
      ? this.collapsedGroups.delete(key)
      : this.collapsedGroups.add(key);
  }

  updateGrouping() {
    const filteredData = this.dataSource.filteredData;
    this.groupedData = this.groupByRecursive(filteredData, this.groupByColumns);
  }

  groupByRecursive(data: Person[], keys: string[], depth = 0): any[] {
    if (depth >= keys.length) return data;

    const key = keys[depth];
    const grouped = data.reduce((acc, item) => {
      const groupKey = item[key];
      acc[groupKey] = acc[groupKey] || [];
      acc[groupKey].push(item);
      return acc;
    }, {} as Record<string, Person[]>);

    return Object.entries(grouped).map(([groupKey, items]) => ({
      key: groupKey,
      level: depth,
      items: this.groupByRecursive(items, keys, depth + 1),
    }));
  }

  isCollapsed(key: string): boolean {
    return this.collapsedGroups.has(key);
  }

  generateKeyPath(group: any, parentKey = ''): string {
    return parentKey ? `${parentKey} > ${group.key}` : group.key;
  }
}
