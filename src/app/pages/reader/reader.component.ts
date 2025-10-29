import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { ReaderService } from "../../services/readerService";
import { IBook } from "../../interfaces/book";
import { PagesLoadedEvent, PageNumberChange } from "ngx-extended-pdf-viewer";

@Component({
  selector: 'app-reader',
  templateUrl: './reader.component.html',
  styleUrl: './reader.component.scss'
})
export class ReaderComponent implements OnInit, OnDestroy{
  currentBook!: IBook;
  currentPage!: 1;
  showNotes!: false;
  showHighlights!: false;
  totalPages!: 0;

  constructor(
    private route: ActivatedRoute,
    private readerService: ReaderService
  ) {}

  ngOnInit(): void {
    const bookId = Number(this.route.snapshot.paramMap.get('id'));
    this.readerService.getBookById(bookId).subscribe((book) => {
      this.currentBook = book;
      if (book.currentPage) {
        this.currentPage = book.currentPage;
      }
      
      if (book.format === 'epub') {
        this.loadedEpub(book.fileUrl);
      }
    });
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
