import { Component, OnInit } from '@angular/core';
import { Observable } from "rxjs";
import { IBook } from "../../interfaces/book";
import { IFolder } from "../../interfaces/folder";
import { IReadingStatus } from "../../interfaces/reading";
import { LibraryService } from "../../core/services/library.service";

type BookStatus = IReadingStatus['status'] | 'all';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrl: './library.component.scss'
})
export class LibraryComponent implements OnInit {
  books$!: Observable<IBook[]>;
  folders$!: Observable<IFolder[]>;

  activeFilter: BookStatus = 'leyendo';

  statusFIlter: { status: BookStatus; label: string }[] = [
    { status: 'leyendo', label: 'Leyendo' },
    { status: 'para-leer', label: 'Para Leer' },
    { status: 'leido', label: 'Leído' },
    { status: 'all', label: 'Todos los libros' }
  ];

  constructor(private libraryService: LibraryService) {}

  ngOnInit(): void {
    this.loadBooksByStatus(this.activeFilter);
    this.folders$ = this.libraryService.getUserFolders();
  }

  loadBooksByStatus(status: BookStatus): void {
    this.activeFilter = status;
    if (status === 'all') {
      this.books$ = this.libraryService.getAllUserBooks();
    } else {
      this.books$ = this.libraryService.getBooksByStatus(status);
    }
  }

  createNewCollection(name: string): void {
    if (name) {
      this.libraryService.createFolder(name).subscribe({
        next: (newFolder) => {
          console.log(`Colección creada: ${newFolder.name}`);
          this.folders$ = this.libraryService.getUserFolders();
        },
        error: (err: unknown) => console.error('Error al crear carpeta:', err),
      });
    }
  }
}
