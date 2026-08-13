import { Component, Input } from '@angular/core';
import { IBook } from "../../interfaces/book";

@Component({
  selector: 'app-last-active-book',
  templateUrl: './last-active-book.component.html',
  styleUrl: './last-active-book.component.scss'
})
export class LastActiveBookComponent {
/*  @Input() lastBook: IBook | undefined | null;

  get readLink(): string {
    return this.lastBook ? `/read/${this.lastBook.id}` : '/library';
  }

  get progressPercentage(): number {
    return this.lastBook?.progress ?? 0;
  }
*/
}