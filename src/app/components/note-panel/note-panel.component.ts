import { Component, Input, OnInit } from '@angular/core';
import { NoteService } from "../../services/note.service";
import { INote } from "../../interfaces/note";

@Component({
  selector: 'app-note-panel',
  templateUrl: './note-panel.component.html',
  styleUrl: './note-panel.component.scss'
})
export class NotePanelComponent implements OnInit{
  @Input() bookId!: number;
  @Input() currentPage!: number;

  notes: INote[] = [];
  newNote = '';

  constructor(private noteService: NoteService) {}

  ngOnInit(): void {
    this.loadNotes();
  }

  loadNotes() {
    this.noteService.getNotes(this.bookId).subscribe({
      next: (res) => this.notes = res.filter(note => note.page === this.currentPage),
      error: (err) => console.log('Error al cargar notas:', err)
    });
  }

  addNote() {
    if (!this.newNote.trim()) return;
    const note: INote = {
      bookId: this.bookId,
      page: this.currentPage,
      text: this.newNote,
      createdAt: new Date
    };

    this.noteService.addNotes(note).subscribe({
      next: (added) => {
        this.notes.push(added);
        this.newNote = '';
      }
    });
  }

  deleteNote(id?: number) {
    if (!id) return;

    this.noteService.deleteNotes(this.bookId, id).subscribe({
      next: () => this.notes = this.notes.filter(note => note.id !== id)
    });
  }
}
