import { notesData } from '../mockData/notes.json';

// Mock delay to simulate API call
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class NotesService {
  constructor() {
    this.notes = [...notesData];
  }

  async getAllByVideoId(videoId) {
    await delay(300);
    return this.notes
      .filter(note => note.videoId === videoId)
      .sort((a, b) => a.timestamp - b.timestamp);
  }

  async getById(id) {
    await delay(200);
    const note = this.notes.find(n => n.id === id);
    if (!note) throw new Error('Note not found');
    return { ...note };
  }

  async create(noteData) {
    await delay(400);
    const newNote = {
      id: Date.now().toString(),
      ...noteData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.notes.push(newNote);
    return { ...newNote };
  }

  async update(id, data) {
    await delay(350);
    const index = this.notes.findIndex(n => n.id === id);
    if (index === -1) throw new Error('Note not found');
    
    this.notes[index] = {
      ...this.notes[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    return { ...this.notes[index] };
  }

  async delete(id) {
    await delay(250);
    const index = this.notes.findIndex(n => n.id === id);
    if (index === -1) throw new Error('Note not found');
    
    this.notes.splice(index, 1);
    return { success: true };
  }

  async searchByVideoId(videoId, query) {
    await delay(300);
    const videoNotes = this.notes.filter(note => note.videoId === videoId);
    return videoNotes.filter(note => 
      note.content.toLowerCase().includes(query.toLowerCase()) ||
      note.title.toLowerCase().includes(query.toLowerCase())
    ).sort((a, b) => a.timestamp - b.timestamp);
  }
}

export default new NotesService();