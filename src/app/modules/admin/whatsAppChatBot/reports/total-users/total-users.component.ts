import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { TableDynamicComponent } from 'app/components/table-dynamic/table-dynamic.component';

@Component({
  selector: 'app-total-users',
  imports: [
      CommonModule,
      TableDynamicComponent
  ],
  templateUrl: './total-users.component.html',
  styleUrl: './total-users.component.scss'
})
export class TotalUsersComponent implements AfterViewInit {
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
