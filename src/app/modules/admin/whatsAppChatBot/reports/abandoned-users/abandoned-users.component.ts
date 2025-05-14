import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { TableDynamicComponent } from 'app/components/table-dynamic/table-dynamic.component';

@Component({
  selector: 'app-abandoned-users',
  imports: [
    CommonModule,
    TableDynamicComponent
  ],
  templateUrl: './abandoned-users.component.html',
  styleUrl: './abandoned-users.component.scss'
})
export class AbandonedUsersComponent implements AfterViewInit {
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
