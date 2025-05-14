import { CommonModule } from '@angular/common';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-dialog-details',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './dialog-details.component.html',
  styleUrls: ['./dialog-details.component.scss'],
})
export class DialogDetailsComponent implements OnInit {
  loading: boolean = false;

  constructor(
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit(): void {
    // this.data = this.data;
  }

  getValue(property){
    return this.data.data[property];
  }

  done(): void {
    this.dialogRef.close(false);
  }
}
