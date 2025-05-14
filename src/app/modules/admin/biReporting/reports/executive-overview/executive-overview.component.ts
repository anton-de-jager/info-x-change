import { AfterViewInit, Component, ElementRef, HostListener, Inject, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ChartDonutSemiComponent } from 'app/components/chart-donut-semi/chart-donut-semi.component';
import { UserService } from 'app/core/user/user.service';
import { InfoxService } from 'app/services/infox.service';

@Component({
  selector: 'app-executive-overview',
  imports: [
    ChartDonutSemiComponent,
    MatCardModule
  ],
  templateUrl: './executive-overview.component.html',
  styleUrl: './executive-overview.component.scss'
})
export class ExecutiveOverviewComponent implements AfterViewInit {
  @ViewChild('firstRow') firstRow!: ElementRef<HTMLDivElement>;
  @ViewChild('secondRow') secondRow!: ElementRef<HTMLDivElement>;

  firstRowHeight: number = 0;
  secondRowHeight: number = 0;

  constructor(
    private _router: Router,
    private infoxService: InfoxService,
    private userService: UserService,
    @Inject(MatDialog) private dialog: MatDialog
  ) {
    this.selectPage('Executive Overview');
  }

  selectPage(page: string): void {
    this._router.navigate([], {
      queryParams: { page },
      queryParamsHandling: 'merge', // Preserve existing query params
    });
  }

  ngAfterViewInit() {
    this.updateRowHeights();
  }

  @HostListener('window:resize')
  onResize() {
    this.updateRowHeights();
  }

  updateRowHeights() {
    this.firstRowHeight = this.firstRow.nativeElement.offsetHeight;
    this.secondRowHeight = this.secondRow.nativeElement.offsetHeight;
  }
}
