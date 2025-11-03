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
  allBooks: IBook[] = [];
  filteredBooks: IBook[] = [];
  isModalOpen: boolean = false;
  newFolder: string = '';

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

  createNewFolder(name: string): void {
    if (name) {
      this.libraryService.createFolder(name).subscribe({
        next: (newFolder) => {
          console.log(`Colección creada: ${newFolder.name}`);
          this.folders$ = this.libraryService.getUserFolders();
        },
        error: (err: unknown) => console.error('Error al crear carpeta:', err),
      });
    }

    if (this.newFolder.trim() === '') return;

    this.libraryService.createFolder(this.newFolder).subscribe(
      (this.newFolder: IFolder) => {
        this.folders.push(newFolder);
        this.newFolder = '';
        this.filterBooks(this.newFolder.id);
        console.log('Carpeta creada:', this.newFolder);
      },
      error => console.error('Fallo al crear carpeta:', error);
    );
  }

  filterBooks(filterValue: string | 'all' | 'reading'): void {
    this.selectedFolderId = filterValue;

    if (filterValue === 'all') {
      this.filteredBooks = [...this.allBooks];
    } else if (filterValue === 'reading') {
      this.filteredBooks = this.allBooks.filter(book => (book.progress ?? 0) > 0 && (book.progress ?? 0) < 100);
    } else {
      this.filteredBooks = this.allBooks.filter(book => book.folderId === filterValue);
    }
  }

  openCreateFolderModal(): void { this.isModalOpen = true }
  closeCreateFolderModal(): void {
    this.isModalOpen = false;
    this.newFolder = '';
  }
}
