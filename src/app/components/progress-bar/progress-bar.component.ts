import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrl: './progress-bar.component.scss'
})
export class ProgressBarComponent {
  @Input() currentPage: number = 0;
  @Input() totalPages: number = 0;
  @Input() title: string = 'Titulo';

  get progressPercentage(): number {
    if (this.totalPages === 0 || this.currentPage === 0) {
      return 0;
    }
    const percent = (this.currentPage / this.totalPages) * 100;
    return Math.min(100, Math.round(percent));
  }
}
