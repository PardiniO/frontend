import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild, NgZone } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { ReaderService } from "../../services/r";
import { NoteService } from "../../services/note.service";
import { HighlightService } from "../../services/highlight.service";
import { IBook } from "../../interfaces/book";
import { INote } from "../../interfaces/note";
import { IHighlight, IRect } from "../../interfaces/highlight";
import { PagesLoadedEvent, PageNumberChange } from "ngx-extended-pdf-viewer";

declare const ePub: undefined;

@Component({
  selector: 'app-reader',
  templateUrl: './reader.component.html',
  styleUrl: './reader.component.scss'
})
export class ReaderComponent implements OnInit, OnDestroy, AfterViewInit{
  currentBook!: IBook;
  currentPage!: 1;
  totalPages!: 0;
  isLoaded = false;
  
  notes: INote[] = [];
  highlights: IHighlight[] = [];

  private epubBook: undefined = null;
  private rendition: undefined = null;

  @ViewChild('epubContainer', { static: false }) epubContainerRef!: ElementRef<HTMLDivElement>;
  @ViewChild('pdfContainer', { static: false }) pdfContainerRef!: ElementRef<HTMLDivElement>;
  @ViewChild('pdfOverlay', { static: false }) pdfOverlayRef!: ElementRef<HTMLDivElement>;

  showNotes!: false;
  showHighlights!: false;

  constructor(
    private route: ActivatedRoute,
    private readerService: ReaderService,
    private noteService: NoteService,
    private highlightService: HighlightService,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    const bookId = Number(this.route.snapshot.paramMap.get('id'));

  }

  loadedEpub(url: string){
    const book = (window as unknown).ePub(url);
    const rendition = book.renderTo('epub-container', 
      { width: '100%', height: '100%' }
    );
    rendition.display();
  }

  toggleNotes() {
    this.showNotes = !this.showNotes;
  }

  toggleHighlight() {
    this.showHighlights = !this.showHighlights;
  }

  onHighlights(color: string) {
    console.log('Texto resaltado con color:', color);
    this.showHighlights = false;
  }

  onPdfLoaded(event: PagesLoadedEvent) {
    this.totalPages = event.pagesCount;
    console.log(`PDF cargando... Total de páginas: ${this.totalPages}`);
  }

  onPageChange(event: PageNumberChange) {
    this.currentPage = event.page;
    console.log(`Página actual: ${this.currentPage}`);
  }

  ngOnDestroy(): void {
    this.readerService.saveProgress(this.currentBook.id, this.currentPage).subscribe(() => {
      console.log('Progreso guardado'),
      (error) => {
        console.log('Error al guardar progreso:', error)
      }
    });
  }
}
