import { NgClass, NgFor, NgForOf, NgIf } from '@angular/common';
import { AfterViewInit, Component, Inject, OnDestroy, inject, ViewEncapsulation } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from "@angular/material/dialog";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FilterItem } from 'app/models/filter.interface';
import { SortPipe } from 'app/pipes/sort.pipe';
import { environment } from 'environments/environment';
import { Subject, Subscription, takeUntil } from 'rxjs';

@Component({
  selector: 'dialog-filter',
  templateUrl: 'dialog-filter.component.html',
  styleUrls: ['./dialog-filter.component.scss'],
  standalone: true,
  imports: [
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatDatepickerModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    NgIf,
    MatSelectModule,
    NgClass,
    SortPipe,
    NgFor,
    NgForOf
  ],
  providers: [SortPipe],
  encapsulation: ViewEncapsulation.None
})
export class DialogFilterComponent implements OnDestroy, AfterViewInit {
  private _unsubscribeAll = new Subject<void>();
  // form!: FormGroup;
  // formErrors: any;
  // formValid!: boolean;
  // formData: any;
  loading: boolean = false;
  // id: string | null = null;
  // filter: FilterItem[];
  // teamNames = [];
  // agents = [];

  constructor(
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogFilterComponent>,
    private _fuseConfirmationService: FuseConfirmationService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    data.form = this.createFormGroupFromFilter();
  }
  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  ngOnInit(): void {
    // this.form = this.data.form;
    // this.formValid = false;
  }

  ngAfterViewInit(): void {
  }

  createFormGroupFromFilter() {
    const formGroup: { [key: string]: any } = {};

    // Loop through the filter and create form controls based on the filterType
    this.data.filter.forEach(filterItem => {
      const { property, filterType, value, multiple } = filterItem;

      if (filterType === 'select' || filterType === 'month' || filterType === 'select-multiple') {
        // For select, use a FormControl for single value or FormArray for multiple values
        if (multiple) {
          // For multiple selection, we expect value to be an array
          formGroup[property] = new FormControl(value);
        } else {
          // For single selection, use a FormControl
          formGroup[property] = new FormControl(value);
        }
      } else if (filterType === 'date-range') {
        // For date-range, use a FormGroup with start and end date FormControls
        formGroup[property] = new FormGroup({
          start: new FormControl(value?.start ?? null),
          end: new FormControl(value?.end ?? null)
        });
      } else {
        // Other types can be handled similarly (e.g., text, number)
        formGroup[property] = new FormControl(value);
      }
    });

    return new FormGroup(formGroup);
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.data.form.controls[controlName].hasError(errorName);
  }

  // onDeleteClick(): void {
  //   this.initDelete(this.id);
  // }

  // async initDelete(id: any) {
  //   const confirmation = this._fuseConfirmationService.open({
  //     title: 'Delete Item',
  //     message: 'Are you sure you want to delete this item? This action cannot be undone!',
  //     actions: {
  //       confirm: {
  //         label: 'Delete',
  //       },
  //     },
  //   });
  //   confirmation.afterClosed()
  //     .pipe(takeUntil(this._unsubscribeAll)).subscribe((result) => {
  //       if (result === 'confirmed') {
  //         this.loading = true;

  //         this.dialogRef.close({ action: 'delete', value: id });
  //         this.loading = false;
  //       }
  //     })
  // }

  onNoClick(): void {
    this.dialogRef.close(false);
  }
  onYesClick(): void {
    const formValues = this.data.form.value;

    this.data.filter = this.data.filter.map(filterItem => {
      const prop = filterItem.property;

      if (filterItem.filterType === 'date-range') {
        return {
          ...filterItem,
          value: {
            start: formValues[prop]?.start ?? null,
            end: formValues[prop]?.end ?? null
          }
        };
      } else if (filterItem.filterType === 'select' || filterItem.filterType === 'month' || filterItem.filterType === 'select-multiple') {
        if (filterItem.multiple) {
          // For multiple selection, we expect value to be an array of selected values
          return {
            ...filterItem,
            value: formValues[prop] // Extract the value from the FormControl
          };
        }
        // For single selection, just return the selected value
        return {
          ...filterItem,
          value: formValues[prop] // This will be the selected value
        };
      } else {
        return {
          ...filterItem,
          value: formValues[prop]
        };
      }
    });

    this.dialogRef.close({ value: this.data.filter });
  }
}
