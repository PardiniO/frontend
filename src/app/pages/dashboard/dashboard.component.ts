import { Component } from '@angular/core';
import { FileService } from "../../core/services/file.service";
import { ReaderService } from "../../core/services/reader.service";
import { IBook } from "../../interfaces/book";
import { catchError, last, Observable } from "rxjs";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  lastActiveBook$!: Observable<IBook | undefined>;
  booksReadCount: number = 0;
  totalReadingTime: string = '0h';

  constructor(
    private readerService: ReaderService,
    private fileService: FileService
  ) {}

  ngOnInit(): void {
    this.lastActiveBook$ = this.readerService.getLastActiveBook();
    this.loadQuickStats();
  }

  private loadQuickStats(): void {
    // simulación:
    this.booksReadCount = 42
    this.totalReadingTime = '25h'; // Debe venir de llamada al backend
  }
}
