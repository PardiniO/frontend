import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild, NgZone,} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from '../../services/book.service';
import { FileService } from '../../services/file.service';
import { ReaderService } from '../../services/reader.service';
import { NoteService } from '../../services/note.service';
import { HighlightService } from '../../services/highlight.service';
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

  notes: INote[] = [];
  highlights: IHighlight[] = [];
  pdfHighlights: IPdfViewerHighlight[] = [];

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
      next: (notes: INote[]) => (this.notes = notes),
      error: (err: unknown) => console.error('Error al cargar notas:', err),
    });

    this.highlightService.getHighlights(bookId).subscribe({
      next: (highlights: IHighlight[]) => {
        this.highlights = highlights;
        if (this.isLoaded) this.renderHighlights();
      },
      error: (err: unknown) => console.error('Error al cargar highlights:', err),
    });
  }

  /* ---------------- EPUB ---------------- */

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

  private addEpubHighlight(cfiRange: string, color: string): void {
    const highlight: IHighlight = {
      bookId: this.currentBook.id,
      color,
      type: 'epub',
      cfi: cfiRange,
      createdAt: new Date
    };

    this.highlightService.addHighlights(highlight).subscribe({
      next: (created) => {
        this.highlights.push(created);
        this.rendition?.annotations.add('highlight', created.cfi!, () => {}, {
          fill: created.color,
          'fill-opacity': '0.6',
          'mix-blend-mode': 'multiply',
        });
      },
      error: (err) => console.error('Error guardando highlight EPUB', err),
    });
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

  onPageRendered(event: { PageNumberChange: number }): void {
    this.currentPage = event.PageNumberChange;
    console.log(`Página actual: ${this.currentPage}`);
  }

  onPdfMouseUp(): void {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;

    const text = selection.toString().trim();
    if (!text) return;

    const highlight: IHighlight = {
      bookId: this.currentBook.id,
      color: '#ffeb3b',
      type: 'pdf',
      highlightedText: text,
      page: this.currentPage,
      createdAt: new Date(),
    };

    this.highlightService.addHighlights(highlight).subscribe({
      next: (created: IHighlight) => {
        this.highlights.push(created);
        selection.removeAllRanges();
      },
      error: (err: unknown) => {
        console.error('Error guardando highlight PDF', err);
        selection.removeAllRanges();
      },
    });
  }

  /* ---------------- RENDER HIGHLIGHTS ---------------- */

  private renderHighlights(): void {
    if (!this.isLoaded) return;

    if (this.currentBook.format === 'epub' && this.rendition) {
      console.log(`Aplicando ${this.highlights.length} resaltados al archivo EPUB...`);

      this.highlights
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
      this.pdfHighlights = this.highlights
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

    this.highlights
      .filter((highlight) => highlight.type === 'epub' && highlight.cfi)
      .forEach((highlight) => {
        this.rendition?.annotations.add('highlight', highlight.cfi!, () => {}, {
          fill: highlight.color,
          'fill-opacity': '0.6',
          'mix-blend-mode': 'multiply',
        });
      });
  }

  deleteHighlight(highlight: IHighlight): void {
    if (!highlight.id) return;

    this.highlightService.deleteHighlights(this.currentBook.id, highlight.id).subscribe({
      next: () => {
        this.highlights = this.highlights.filter((x) => x.id !== highlight.id);
        if (highlight.type === 'epub' && this.rendition && highlight.cfi) {
          this.rendition.annotations.remove(highlight.cfi);
        }
      },
      error: (err: unknown) => console.error('Error borrando highlight', err),
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
      )
      .pipe(
        take(1)
      )
      .subscribe({
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