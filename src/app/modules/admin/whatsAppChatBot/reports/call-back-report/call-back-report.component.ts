import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { TableDynamicComponent } from 'app/components/table-dynamic/table-dynamic.component';

@Component({
  selector: 'app-call-back-report',
  imports: [
      CommonModule,
      TableDynamicComponent
  ],
  templateUrl: './call-back-report.component.html',
  styleUrl: './call-back-report.component.scss'
})
export class CallBackReportComponent implements AfterViewInit {
  @ViewChild('pageContainer') pageContainer!: ElementRef<HTMLDivElement>;
  totalHeight: number;

  constructor(
  ) {
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
      const totalHeight = this.pageContainer.nativeElement.clientHeight;
      this.totalHeight = totalHeight - 72;
    }, 100);
  }
}
