import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild, NgZone,} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from '../../core/services/book.service';
import { FileService } from '../../core/services/file.service';
import { ReaderService } from '../../core/services/reader.service';
import { NoteService } from '../../core/services/note.service';
import { HighlightService } from '../../core/services/highlight.service';
import { IBook } from '../../interfaces/book';
import { INote } from '../../interfaces/note';
import { IHighlight, IRect } from '../../interfaces/highlight';
import { IEpub, IEpubRendition, IEpubContents } from "../../interfaces/epub";
import { PagesLoadedEvent, IPdfViewerHighlight } from "ngx-extended-pdf-viewer";
import { take } from 'rxjs';

declare function ePub(url: string): IEpub;

@Component({
  selector: 'app-reader',
  templateUrl: './reader.component.html',
  styleUrls: ['./reader.component.scss'],
})
export class ReaderComponent implements OnInit, AfterViewInit, OnDestroy {
  currentBook!: IBook;
  currentPage: number = 1;
  totalPages: number = 0;
  isLoaded: boolean = false;

  showNotes: boolean = false;
  showHighlights: boolean = false;

  allNotes: INote[] = [];
  allHighlights: IHighlight[] = [];
  pdfHighlights: IPdfViewerHighlight[] = [];
  notesForCurrentPage: INote[] = [];

  private epubBook: IEpub | null = null;
  private rendition: IEpubRendition | null = null;

  @ViewChild('epubContainer') epubContainerRef?: ElementRef<HTMLDivElement>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private readerService: ReaderService,
    private noteService: NoteService,
    private highlightService: HighlightService,
    private ngZone: NgZone,
    private bookService: BookService,
    private fileService: FileService,
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) {
      console.error('ID de libro no proporcionado.');
      this.router.navigate(['/library']);
      return;
    };

    const bookId: number = Number(idParam);
    if (isNaN(bookId)) {
      console.error('ID de libro inválido.');
      this.router.navigate(['/library']);
      return;
    }
    this.loadBook(bookId);
  }

  ngAfterViewInit(): void {}

  onPageChange(newPage: number): void {
    this.currentPage = newPage;
    this.filterNotesByPage(this.currentPage);
  }

  private loadBook(bookId: number): void {
    this.bookService.getBooksById(bookId).subscribe({
      next: (book) => {
        this.currentBook = book;
        if (book.currentPage) this.currentPage = book.currentPage;
        this.loadNotesAndHighlights(book.id);

        const fileUrl = book.fileUrl;
        if (book.format === 'pdf') this.initializePdf(fileUrl);
        if (book.format === 'epub') this.initializeEpub(fileUrl);
      },
      error: (err: unknown) => console.error('Error al cargar libro:', err),
    });
  }

  private loadNotesAndHighlights(bookId: number): void {
    this.noteService.getNotes(bookId).subscribe({
      next: (notes: INote[]) => {
        this.allNotes = notes;
        this.filterNotesByPage(this.currentPage);
      },
      error: (err: unknown) => console.error('Error al cargar notas:', err),
    });

    this.highlightService.getHighlights(bookId).subscribe({
      next: (highlights: IHighlight[]) => {
        this.allHighlights = highlights;
        if (this.isLoaded) this.renderHighlights();
      },
      error: (err: unknown) => console.error('Error al cargar highlights:', err),
    });
  }
  

  /* ---------------- EPUB ---------------- */
  private addEpubHighlight(cfiRange: string, color: string): void {
    const highlight: IHighlight = {
      bookId: this.currentBook.id,
      color,
      type: 'epub',
      cfi: cfiRange,
      createdAt: new Date
    };

    this.highlightService.addHighlights(highlight).subscribe({
      next: (created: IHighlight) => {
        this.allHighlights.push(created);
        this.rendition?.annotations.add('highlight', created.cfi!, () => {}, {
          fill: created.color,
          'fill-opacity': '0.6',
          'mix-blend-mode': 'multiply',
        });
      },
      error: (err) => console.error('Error guardando highlight EPUB', err),
    });
  }

  private initializeEpub(fileUrl: string): void {
    const epubContainer = this.epubContainerRef?.nativeElement;
    if (!epubContainer) return;

    const epubInstance = ePub(fileUrl) as IEpub;
    this.epubBook = epubInstance;


    const rendition = epubInstance.renderTo(epubContainer, { 
      width: '100%', 
      height: '100%' 
    });  
    this.rendition = rendition;
    rendition.display();

    rendition.on('selected', (cfiRange: string, contents: IEpubContents) => {
      this.ngZone.run(() => {
        const color = '#fafa75';
        this.addEpubHighlight(cfiRange, color);
        contents.window.getSelection()?.removeAllRanges();
      });  
    });  

    this.isLoaded = true;
    this.renderHighlights();
  }  

  /* ---------------- PDF HANDLERS ---------------- */

  private initializePdf(_fileUrl: string): void {
    this.isLoaded = true;
  }

  onPdfLoaded(event: PagesLoadedEvent): void {
    this.totalPages = event.pagesCount;
    if (this.currentBook.currentPage) {
      this.currentPage = this.currentBook.currentPage;
    }
    this.renderHighlights();
    console.log(`PDF cargado. Total de páginas: ${this.totalPages}`);
  }

  onPageRendered(newPage: number): void {
    this.currentPage = newPage;
    console.log(`Página actual: ${this.currentPage}`);
    this.filterNotesByPage(newPage);
  }

  onPdfTextSelected(text: string, rects: IRect[]): void {
    if (text.trim() === '') return;

    const newHighlight: IHighlight = {
      bookId: this.currentBook.id,
      page: this.currentPage,
      rects: rects,
      type: 'pdf',
      highlightedText: text,
      color: '#ffeb3b',
      createdAt: new Date()
    };

    this.highlightService.addHighlights(newHighlight).subscribe({
      next: (saved: IHighlight) => {
        this.allHighlights.push(saved);
        this.renderHighlights();
        console.log('Resaltado guardado:', saved);
      },
      error: (err: unknown) => console.error('Error al guardar resaltado:', err)
    });
  }

  /* ---------------- RENDER HIGHLIGHTS ---------------- */

  private renderHighlights(): void {
    if (!this.isLoaded) return;

    const highlights = this.allHighlights;

    if (this.currentBook.format === 'epub' && this.rendition) {
      console.log(`Aplicando ${highlights.length} resaltados al archivo EPUB...`);

      highlights
        .filter((highlight: IHighlight) => highlight.type === 'epub' && highlight.cfi)
        .forEach((highlight: IHighlight) => {
          try {
            this.rendition?.annotations.add('highlight', highlight.cfi!, () => {}, {
              fill: highlight.color,
              'fill-opacity': '0.6',
              'mix-blend-mode': 'multiply',
            });
          } catch (err: unknown) {
            console.error(`Error aplicando resaltado al EPUB con CFI ${highlight.cfi}:`, err);
          }
        });
        
      this.rendition.display();
    }

    if (this.currentBook.format === 'pdf') {
      this.pdfHighlights = highlights
        .filter(highlight => highlight.type === 'pdf' && highlight.rects)
        .flatMap(highlight => {
          return (highlight.rects as IRect[]).map((rect: IRect): IPdfViewerHighlight => ({
            page: rect.page,
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
            color: highlight.color,
            id: highlight.id
          }));
        });
    }
  }

  deleteHighlight(highlight: IHighlight): void {
    if (!highlight.id) return;

    this.highlightService.deleteHighlights(this.currentBook.id, highlight.id).subscribe({
      next: () => {
        this.allHighlights = this.allHighlights.filter((index: IHighlight) => index.id !== highlight.id);
        if (highlight.type === 'epub' && this.rendition && highlight.cfi) {
          this.rendition.annotations.remove(highlight.cfi);
        } else if (highlight.type === 'pdf') {
          this.renderHighlights();
        }
      },
      error: (err: unknown) => console.error('Error al borrar resaltado', err),
    });
  }

  /* ---------------- NOTES ---------------- */
  filterNotesByPage(page: number): void {
    this.notesForCurrentPage = this.allNotes.filter((note: INote) => note.page === page);
  }

  onNoteAdded(content: string): void {
    const newNote: INote = {
      bookId: this.currentBook.id,
      page: this.currentPage,
      text: content,
      createdAt: new Date()
    } as INote;

    this.noteService.addNotes(newNote).subscribe({
      next: (savedNote: INote) => {
        this.allNotes.push(savedNote);
        this.filterNotesByPage(this.currentPage);
        console.log('Nota guardada:', savedNote);
      },
      error: (err: unknown) => console.error('Error al guardar nota:', err)
    });
  }

  /* ---------------- CLEANUP ---------------- */

  ngOnDestroy(): void {
    if (this.currentBook && this.totalPages > 0) {
      const calculatedProgress = Math.min(
        100,
        Math.round((this.currentPage / this.totalPages) * 100)
      );

      this.readerService.saveProgress(
        this.currentBook.id, 
        this.currentPage,
        calculatedProgress
      ).pipe(take(1)).subscribe({
        next: () => {
          console.log(`Progreso de lectura guardado: ${calculatedProgress}%`);
        },
        error: (err: unknown) => console.error('Fallo al guardar progreso:', err)
      });
    }

    try {
      this.rendition?.destroy();
    } catch (err) {
      console.warn('Error destruyendo EPUB:', err);
    }
  }

  /* ---------------- BUTTON ACTIONS ---------------- */
  toggleNotes() {
    this.showNotes = !this.showNotes;
    if (this.showNotes) this.showHighlights = false;
  }

  toggleHighlights() {
    this.showHighlights = !this.showHighlights;
    if (this.showHighlights) this.showNotes = false;
  }

  goBack() {
    this.router.navigate(['/library']);
    console.log('Volver a la biblioteca');
  }

  openSettings() {
    this.router.navigate(['/settings'], { queryParams: { returnUrl: this.router.url } });
    console.log('Abrir ajustes de lectura');
  }

  onHighlight(color: string) {
    console.log('Resaltado seleccionado:', color);
  }
}