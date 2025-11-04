import { Component, OnInit } from '@angular/core';
import { ReaderService } from "../../core/services/reader.service";
import { IUserStats } from "../../interfaces/user";

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.scss'
})
export class StatsComponent implements OnInit{
  userStats: IUserStats | undefined;
  pagesReadDate: { month: string, pages: number }[] = [];

  constructor(private readerService: ReaderService) {}

  ngOnInit(): void {
    this.loadUserStats();
  }

  private defaultStats: IUserStats = {
    totalBooksRead: 0,
    totalHoursSpend: 0,
    favoriteGenre: 'N/A',
    avgPagesPerSession: 0,
    readingHistory: [],
    pagesReadByMonth: []
  };

  private loadUserStats(): void {
    this.readerService.getStats().subscribe({
      next: (stats: IUserStats) => {
        this.userStats = stats,
        this.pagesReadDate = stats.pagesReadByMonth
      },
      error: (err: unknown) => {
        this.userStats = this.defaultStats,
        console.error('Error al cargar estadísticas', err)
      }
    });
  }
}