import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-highlight-toolbar',
  templateUrl: './highlight-toolbar.component.html',
  styleUrl: './highlight-toolbar.component.scss'
})
export class HighlightToolbarComponent {
  colors: string[] = ['#fbea53ff', '#62c078ff', '#ea7bd5ff', '#ffa861ff', '#b68cdbff'];
  selectedColor: string = this.colors[0];

  @Output() highlightColorSelected = new EventEmitter<string>();

  selectColor(color: string): void {
    this.selectedColor = color;
  }

  confirmHighlight(): void {
    this.highlightColorSelected.emit(this.selectedColor);
  }
}
