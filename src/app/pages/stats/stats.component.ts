import { Component, OnInit } from '@angular/core';
import { Observable, catchError, map, of } from "rxjs";
import { ReaderService } from "../../core/services/reader.service";
import { IUserStats } from "../../interfaces/user";

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.scss'
})
export class StatsComponent implements OnInit{
  userStats$!: Observable<IUserStats>;

  pagesReadDate: { month: string, pages: number }[] = [];

  constructor(private readerService: ReaderService) {}

  ngOnInit(): void {
    this.loadUserStats();
  }

  private loadUserStats(): void {
    this.userStats$ = this.readerService.getReadingHistory().pipe(
      map((stats: IUserStats) => stats),
      catchError(err => {
        console.error('Error cargando estadísticas:', err);

        return of ({
          totalBooksRead: 0,
          totalHoursSpend: 0,
          favoriteGenre: 'N/A',
          avgPagesPerSession: 0,
          readingHistory: [],
          pagesReadByMonth: []
        } as IUserStats);
      })
    );
  }
}