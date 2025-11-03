import { Component, OnInit, untracked } from '@angular/core';
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
  folders: IFolder[] = [];
  selectedFolderId: number | 'all' | 'reading' = 'all';
  newFolderName: string = '';

  statusFIlters: { status: BookStatus; label: string }[] = [
    { status: 'leyendo', label: 'Leyendo' },
    { status: 'para-leer', label: 'Para Leer' },
    { status: 'leido', label: 'Leído' },
    { status: 'all', label: 'Todos los libros' }
  ];

  constructor(private libraryService: LibraryService) {}

  ngOnInit(): void {
    this.loadAllData();
  }

  private loadAllData(): void {
    this.libraryService.getAllUserBooks().subscribe({
      next: (books: IBook[]) => {
        this.allBooks = books;
        this.filterBooks('leyendo');
      },
      error: (err: unknown) => console.error('Error cargando todos los libros:', err)
    });
  }

  loadBooksByStatus(status: BookStatus): void {
    this.activeFilter = status;
    this.filterBooks(status);
  }

  createNewFolder(name: string): void {
    if (this.newFolderName.trim() === '') return;

    const folderName = this.newFolderName.trim();

    this.libraryService.createFolder(folderName).subscribe({
        next: (newFolder: IFolder) => {
          console.log(`Colección creada: ${newFolder.name}`);
          this.folders.push(newFolder);
          this.newFolderName = '';
          this.closeCreateFolderModal();
          this.filterBooks(newFolder.id);
        },
        error: (err: unknown) => console.error('Error al crear carpeta:', err),
      });
    }

  filterBooks(filterValue: BookStatus | number): void {
    this.activeFilter = (typeof filterValue === 'string') ? filterValue : 'all';

    if (filterValue === 'all') {
      this.filteredBooks = [...this.allBooks];
    } else if (filterValue === 'leyendo') {
      this.filteredBooks = this.allBooks.filter(book => (book.progress ?? 0) > 0 && (book.progress ?? 0) < 100);
    } else if (filterValue === 'leido' || filterValue === 'para-leer') {
      this.filteredBooks = this.allBooks.filter(book => book.status === filterValue);
    } else if (typeof filterValue === 'number') {
      const selectedFolder = this.folders.find(file => file.id === filterValue);

      if (selectedFolder) {
        this.filteredBooks = this.allBooks.filter(book => selectedFolder.bookId.includes(book.id));
      } else {
        this.filteredBooks = [];
      }
    }

    this.books$ = of(this.filteredBooks);
  }

  openCreateFolderModal(): void { this.isModalOpen = true }
  closeCreateFolderModal(): void {
    this.isModalOpen = false;
    this.newFolderName = '';
  }
}
