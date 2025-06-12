import notesData from '@/services/mockData/notes.json' assert { type: 'json' };

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class NotesService {
  constructor() {
    try {
      // Fix: Access the notesData array from the JSON object structure
      // The JSON file contains { "notesData": [...] }, not a direct array
      const notes = notesData?.notesData || [];
      if (!Array.isArray(notes)) {
        throw new Error('Invalid notes data structure: expected array');
      }
      this.notes = [...notes];
    } catch (error) {
      console.error('NotesService initialization error:', error);
      this.notes = []; // Fallback to empty array
    }
  }

  async getAll() {
    try {
      await delay(300);
      if (!Array.isArray(this.notes)) {
        return [];
      }
      return [...this.notes].sort((a, b) => {
        const dateA = new Date(a?.createdAt || 0);
        const dateB = new Date(b?.createdAt || 0);
        return dateB - dateA;
      });
    } catch (error) {
      console.error('Error getting all notes:', error);
      throw new Error('Failed to retrieve notes');
    }
  }

  async getByVideoId(videoId) {
    try {
      if (!videoId) {
        throw new Error('Video ID is required');
      }
      
      await delay(200);
      return this.notes.filter(note => note?.videoId === videoId);
    } catch (error) {
      console.error('Error getting notes by video ID:', error);
      throw new Error('Failed to retrieve notes for video');
    }
  }

  async getByCourseId(courseId) {
    try {
      if (!courseId) {
        throw new Error('Course ID is required');
      }
      
      await delay(200);
      return this.notes.filter(note => note?.courseId === courseId);
    } catch (error) {
      console.error('Error getting notes by course ID:', error);
      throw new Error('Failed to retrieve notes for course');
    }
  }

  async getById(id) {
    try {
      if (!id) {
        throw new Error('Note ID is required');
      }
      
      await delay(100);
      const note = this.notes.find(note => note?.id === id);
      return note || null;
    } catch (error) {
      console.error('Error getting note by ID:', error);
      throw new Error('Failed to retrieve note');
    }
  }

  async create(noteData) {
    try {
      if (!noteData || typeof noteData !== 'object') {
        throw new Error('Valid note data is required');
      }
      
      if (!noteData.content) {
        throw new Error('Note content is required');
      }
      
      await delay(300);
      
      const newNote = {
        id: Date.now().toString(),
        ...noteData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      this.notes.push(newNote);
      return newNote;
    } catch (error) {
      console.error('Error creating note:', error);
      throw new Error('Failed to create note');
    }
  }

  async update(id, updates) {
    try {
      if (!id) {
        throw new Error('Note ID is required');
      }
      
      if (!updates || typeof updates !== 'object') {
        throw new Error('Valid update data is required');
      }
      
      await delay(250);
      
      const noteIndex = this.notes.findIndex(note => note?.id === id);
      if (noteIndex === -1) {
        throw new Error('Note not found');
      }
      
      this.notes[noteIndex] = {
        ...this.notes[noteIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      return this.notes[noteIndex];
    } catch (error) {
      console.error('Error updating note:', error);
      throw new Error('Failed to update note');
    }
  }

async delete(id) {
    try {
      if (!id) {
        throw new Error('Note ID is required');
      }
      
      await delay(200);
      
      const noteIndex = this.notes.findIndex(note => note?.id === id);
      if (noteIndex === -1) {
        throw new Error('Note not found');
      }
      
      const deletedNote = this.notes[noteIndex];
      this.notes.splice(noteIndex, 1);
      return deletedNote;
    } catch (error) {
      console.error('Error deleting note:', error);
      throw new Error('Failed to delete note');
    }
  }
}

// Create and export default instance
const notesService = new NotesService();
export default notesService;