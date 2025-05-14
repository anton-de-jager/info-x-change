import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { TableDynamicComponent } from 'app/components/table-dynamic/table-dynamic.component';

@Component({
  selector: 'app-ozow-payments',
  imports: [
      CommonModule,
      TableDynamicComponent
  ],
  templateUrl: './ozow-payments.component.html',
  styleUrl: './ozow-payments.component.scss'
})
export class OzowPaymentsComponent implements AfterViewInit {
  @ViewChild('pageContainer') pageContainer!: ElementRef<HTMLDivElement>;
  totalHeight: number;

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
