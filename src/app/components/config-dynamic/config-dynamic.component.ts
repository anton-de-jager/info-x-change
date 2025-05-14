import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { DialogConfigDynamicComponent } from 'app/dialogs/dialog-config-dynamic/dialog-config-dynamic.component';

@Component({
  selector: 'app-config-dynamic',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, HttpClientModule],
  templateUrl: './config-dynamic.component.html',
  styleUrls: ['./config-dynamic.component.scss'],
})
export class ConfigDynamicComponent {
  private http = inject(HttpClient);
  private dialog = inject(MatDialog);

  tables = signal<any[]>([]);
  displayedColumns = signal<string[]>(['tableName', 'actions']);

  constructor() {
    effect(() => {
      this.http.get<any[]>(`/api/DynamicTable`).subscribe(data => this.tables.set(data));
    });
  }

  openDialog(table?: any) {
    this.dialog.open(DialogConfigDynamicComponent, { data: table });
  }
}