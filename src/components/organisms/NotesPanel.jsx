import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import notesService from '@/services/api/notesService';

const NotesPanel = ({ isOpen, onClose, videoId, currentTime, onSeekTo }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (isOpen && videoId) {
      loadNotes();
    }
  }, [isOpen, videoId]);

  const loadNotes = async () => {
    try {
      setLoading(true);
      const data = await notesService.getAllByVideoId(videoId);
      setNotes(data);
    } catch (error) {
      toast.error('Failed to load notes');
      console.error('Error loading notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNote = async () => {
    if (!newNote.title.trim() && !newNote.content.trim()) {
      toast.warning('Please enter a title or content for the note');
      return;
    }

    try {
      const noteData = {
        videoId,
        timestamp: currentTime,
        title: newNote.title.trim() || 'Note',
        content: newNote.content.trim()
      };

      const createdNote = await notesService.create(noteData);
      setNotes(prev => [...prev, createdNote].sort((a, b) => a.timestamp - b.timestamp));
      setNewNote({ title: '', content: '' });
      toast.success('Note saved successfully');
    } catch (error) {
      toast.error('Failed to save note');
      console.error('Error creating note:', error);
    }
  };

  const handleUpdateNote = async (id, data) => {
    try {
      const updatedNote = await notesService.update(id, data);
      setNotes(prev => prev.map(note => note.id === id ? updatedNote : note));
      setEditingNote(null);
      toast.success('Note updated successfully');
    } catch (error) {
      toast.error('Failed to update note');
      console.error('Error updating note:', error);
    }
  };

  const handleDeleteNote = async (id) => {
    if (!confirm('Are you sure you want to delete this note?')) return;

    try {
      await notesService.delete(id);
      setNotes(prev => prev.filter(note => note.id !== id));
      toast.success('Note deleted successfully');
    } catch (error) {
      toast.error('Failed to delete note');
      console.error('Error deleting note:', error);
    }
  };

  const formatTimestamp = (timestamp) => {
    const minutes = Math.floor(timestamp / 60);
    const seconds = Math.floor(timestamp % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 flex flex-col border-l border-gray-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Video Notes</h2>
            <Button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
              icon={<ApperIcon name="X" size={20} className="text-gray-600" />}
            />
          </div>

          {/* Search */}
          <div className="p-4 border-b border-gray-200">
            <Input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Add New Note */}
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Add note at {formatTimestamp(currentTime)}
                </span>
              </div>
              <Input
                type="text"
                placeholder="Note title (optional)"
                value={newNote.title}
                onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
                className="w-full text-sm"
              />
              <textarea
                placeholder="Write your note here..."
                value={newNote.content}
                onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-lg resize-none text-sm"
                rows="3"
              />
              <Button
                onClick={handleCreateNote}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 text-sm"
              >
                Save Note
              </Button>
            </div>
          </div>

          {/* Notes List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">Loading notes...</div>
            ) : filteredNotes.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                {searchQuery ? 'No notes found' : 'No notes yet. Add your first note above!'}
              </div>
            ) : (
              <div className="space-y-2 p-4">
                {filteredNotes.map((note) => (
                  <div key={note.id} className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
                    {editingNote === note.id ? (
                      <EditNoteForm
                        note={note}
                        onSave={(data) => handleUpdateNote(note.id, data)}
                        onCancel={() => setEditingNote(null)}
                      />
                    ) : (
                      <NoteCard
                        note={note}
                        onEdit={() => setEditingNote(note.id)}
                        onDelete={() => handleDeleteNote(note.id)}
                        onSeek={() => onSeekTo(note.timestamp)}
                        formatTimestamp={formatTimestamp}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const NoteCard = ({ note, onEdit, onDelete, onSeek, formatTimestamp }) => (
  <>
    <div className="flex items-start justify-between mb-2">
      <button
        onClick={onSeek}
        className="text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
      >
        {formatTimestamp(note.timestamp)}
      </button>
      <div className="flex space-x-1">
        <Button
          onClick={onEdit}
          className="p-1 hover:bg-gray-100 rounded"
          icon={<ApperIcon name="Edit2" size={14} className="text-gray-500" />}
        />
        <Button
          onClick={onDelete}
          className="p-1 hover:bg-gray-100 rounded"
          icon={<ApperIcon name="Trash2" size={14} className="text-red-500" />}
        />
      </div>
    </div>
    {note.title && (
      <h4 className="font-medium text-gray-900 text-sm mb-1">{note.title}</h4>
    )}
    <p className="text-gray-700 text-sm leading-relaxed">{note.content}</p>
  </>
);

const EditNoteForm = ({ note, onSave, onCancel }) => {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);

  const handleSave = () => {
    onSave({ title: title.trim(), content: content.trim() });
  };

  return (
    <div className="space-y-3">
      <Input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Note title"
        className="w-full text-sm"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-lg resize-none text-sm"
        rows="3"
      />
      <div className="flex space-x-2">
        <Button
          onClick={handleSave}
          className="flex-1 bg-blue-600 text-white py-1 px-3 rounded text-sm hover:bg-blue-700"
        >
          Save
        </Button>
        <Button
          onClick={onCancel}
          className="flex-1 bg-gray-200 text-gray-800 py-1 px-3 rounded text-sm hover:bg-gray-300"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default NotesPanel;