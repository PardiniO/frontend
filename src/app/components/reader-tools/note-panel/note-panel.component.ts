import { Component, EventEmitter, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NoteService } from "../../../core/services/note.service";
import { INote } from "../../../interfaces/note";

@Component({
  selector: 'app-note-panel',
  templateUrl: './note-panel.component.html',
  styleUrl: './note-panel.component.scss'
})
export class NotePanelComponent /*implements OnInit, OnChanges*/{
/*  private _currentPage!: number;
  @Input()
  set currentPage(page: number) {
    if (page !== this._currentPage) {
      this._currentPage = page;
      if (this.bookId) {
        this.loadNotes();
      }
    }
  }
  get currentPage(): number {
    return this._currentPage;
  }
  @Input() bookId!: number;
  @Input() notes: INote[] = [];
  @Input() noteAdded = new EventEmitter<string>();

  newNote: string = '';

  constructor(private noteService: NoteService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['bookId'] && this.bookId) {
      this.loadNotes();
    }
  }

  ngOnInit(): void {
    // this.loadNotes();
  }

  loadNotes() {
    if (!this.bookId || !this.currentPage) return;

    this.noteService.getNotes(this.bookId).subscribe({
      next: (notes: INote[]) => this.notes = notes.filter(note => note.page === this.currentPage),
      error: (err: unknown) => console.log('Error al cargar notas:', err)
    });
  }

  addNote(): void {
    if (this.newNote.trim() !== '') {
      this.noteAdded.emit(this.newNote);
      this.newNote = '';
    };

    const note: INote = {
      id: undefined,
      bookId: this.bookId,
      page: this.currentPage,
      text: this.newNote,
      createdAt: new Date()
    };

    this.noteService.addNotes(note).subscribe({
      next: (addedNote: INote) => {
        this.notes.push(addedNote);
        this.newNote = '';
      },
      error: (err: unknown) => console.error('Error al agregar nota:', err)
    });
  }

  deleteNote(id?: number): void {
    if (!id) return;

    this.noteService.deleteNotes(this.bookId, id).subscribe({
      next: () => this.notes = this.notes.filter((note: INote) => note.id !== id),
      error: (err: unknown) => console.error('Error al borrar nota:', err)
    });
  }
*/
}
