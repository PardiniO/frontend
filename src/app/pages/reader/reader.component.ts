import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild, NgZone,} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookService } from '../../services/book.service';
import { FileService } from '../../services/file.service';
import { ReaderService } from '../../services/reader.service';
import { NoteService } from '../../services/note.service';
import { HighlightService } from '../../services/highlight.service';
import { IBook } from '../../interfaces/book';
import { INote } from '../../interfaces/note';
import { IHighlight } from '../../interfaces/highlight';
import { IEpub, IEpubRendition, IEpubContents } from "../../interfaces/epub";
import { reduce } from 'rxjs';

declare function ePub(url: string): IEpub;

@Component({
  selector: 'app-reader',
  templateUrl: './reader.component.html',
  styleUrls: ['./reader.component.scss'],
})
export class ReaderComponent implements OnInit, AfterViewInit, OnDestroy {
  currentBook!: IBook;
  currentPage = 1;
  totalPages = 0;
  isLoaded = false;

  notes: INote[] = [];
  highlights: IHighlight[] = [];

  private epubBook: unknown = null;
  private rendition: IEpubRendition | null = null;

  @ViewChild('epubContainer') epubContainerRef?: ElementRef<HTMLDivElement>;
  @ViewChild('pdfContainer') pdfContainerRef?: ElementRef<HTMLDivElement>;

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private fileService: FileService,
    private readerService: ReaderService,
    private noteService: NoteService,
    private highlightService: HighlightService,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) return;

    const bookId = Number(idParam);
    this.loadBook(bookId);
  }

  ngAfterViewInit(): void {}

  private loadBook(bookId: number): void {
    this.bookService.getBooksById(bookId).subscribe({
      next: (book) => {
        this.currentBook = book;
        this.loadNotesAndHighlights(book.id);

        const fileUrl = book.fileUrl;
        if (book.format === 'pdf') this.initializePdf(fileUrl);
        if (book.format === 'epub') this.initializeEpub(fileUrl);
      },
      error: (err) => console.error('Error al cargar libro:', err),
    });
  }

  private loadNotesAndHighlights(bookId: number): void {
    this.noteService.getNotes(bookId).subscribe({
      next: (notes) => (this.notes = notes),
      error: (err) => console.error('Error al cargar notas:', err),
    });

    this.highlightService.getHighlights(bookId).subscribe({
      next: (highlights) => {
        this.highlights = highlights;
        if (this.isLoaded) this.renderHighlights();
      },
      error: (err) => console.error('Error al cargar highlights:', err),
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

  /* ---------------- PDF ---------------- */

  private initializePdf(fileUrl: string): void {
    this.isLoaded = true;
  }

  onPdfLoaded(event: { pagesCount: number }): void {
    this.totalPages = event.pagesCount;
  }

  onPageRendered(event: { pageNumber: number }): void {
    this.currentPage = event.pageNumber;
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
    if (!this.isLoaded || this.currentBook.format !== 'epub' || !this.rendition) return;

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
    if (this.currentBook) {
      this.readerService.saveProgress(this.currentBook.id, this.currentPage).subscribe();
    }

    try {
      this.rendition?.destroy();
    } catch (err) {
      console.warn('Error destruyendo EPUB:', err);
    }
  }
}