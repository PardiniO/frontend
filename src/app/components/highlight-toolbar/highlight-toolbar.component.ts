import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-highlight-toolbar',
  templateUrl: './highlight-toolbar.component.html',
  styleUrl: './highlight-toolbar.component.scss'
})
export class HighlightToolbarComponent {
  colors = ['#D8658A', '#fafa75', '#38855D', '#73338D', '#2D7AAD', '#ffb347', '#77dd77'];
  selectedColor = '#fafa75';

  @Output() highlight = new EventEmitter<string>();

  selectColor(color: string) {
    this.selectedColor = color;
  }

  confirmHighlight() {
    this.highlight.emit(this.selectedColor);
  }
}
