import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import ContentLoader from '@/components/organisms/ContentLoader';
import ErrorDisplay from '@/components/organisms/ErrorDisplay';
import EmptyDisplay from '@/components/organisms/EmptyDisplay';
import notesService from '@/services/api/notesService';

const NotesPage = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [editingNote, setEditingNote] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', content: '' });

  useEffect(() => {
    loadAllNotes();
  }, []);

  useEffect(() => {
    filterNotes();
  }, [notes, searchTerm, selectedCourse]);

  const loadAllNotes = async () => {
    try {
      setLoading(true);
      setError(null);
      const allNotes = await notesService.getAll();
      setNotes(allNotes);
    } catch (err) {
      setError('Failed to load notes');
      toast.error('Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  const filterNotes = () => {
    let filtered = notes;

    if (searchTerm) {
      filtered = filtered.filter(note =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (note.courseName && note.courseName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (note.lessonName && note.lessonName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCourse) {
      filtered = filtered.filter(note => note.courseName === selectedCourse);
    }

    setFilteredNotes(filtered);
  };

  const handleDeleteNote = async (noteId) => {
    if (!confirm('Are you sure you want to delete this note?')) return;

    try {
      await notesService.delete(noteId);
      setNotes(prev => prev.filter(note => note.id !== noteId));
      toast.success('Note deleted successfully');
    } catch (err) {
      toast.error('Failed to delete note');
    }
  };

  const handleEditNote = (note) => {
    setEditingNote(note.id);
    setEditForm({ title: note.title, content: note.content });
  };

  const handleSaveEdit = async () => {
    try {
      const updatedNote = await notesService.update(editingNote, editForm);
      setNotes(prev => prev.map(note => 
        note.id === editingNote ? updatedNote : note
      ));
      setEditingNote(null);
      setEditForm({ title: '', content: '' });
      toast.success('Note updated successfully');
    } catch (err) {
      toast.error('Failed to update note');
    }
  };

  const handleCancelEdit = () => {
    setEditingNote(null);
    setEditForm({ title: '', content: '' });
  };

  const formatTimestamp = (timestamp) => {
    const minutes = Math.floor(timestamp / 60);
    const seconds = Math.floor(timestamp % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const uniqueCourses = [...new Set(notes.map(note => note.courseName).filter(Boolean))];

  const groupedNotes = filteredNotes.reduce((acc, note) => {
    const courseKey = note.courseName || 'Other';
    if (!acc[courseKey]) {
      acc[courseKey] = [];
    }
    acc[courseKey].push(note);
    return acc;
  }, {});

  if (loading) return <ContentLoader />;
  if (error) return <ErrorDisplay message={error} onRetry={loadAllNotes} />;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">
                My Notes
              </h1>
              <p className="text-gray-600">
                {notes.length} notes across your learning journey
              </p>
            </div>
            <Button
              onClick={() => navigate('/my-learning')}
              className="flex items-center gap-2 bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              <ApperIcon name="ArrowLeft" size={16} />
              Back to My Learning
            </Button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-lg shadow-sm">
            <div className="flex-1">
              <Input
                placeholder="Search notes, courses, or lessons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
                icon={<ApperIcon name="Search" size={16} />}
              />
            </div>
            <div className="sm:w-64">
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">All Courses</option>
                {uniqueCourses.map(course => (
                  <option key={course} value={course}>{course}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Notes Content */}
        {filteredNotes.length === 0 ? (
          <EmptyDisplay
            title="No notes found"
            message={searchTerm || selectedCourse 
              ? "Try adjusting your search or filter criteria"
              : "Start taking notes while watching course videos to see them here"
            }
            icon="FileText"
          />
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedNotes).map(([courseName, courseNotes]) => (
              <div key={courseName} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b">
                  <h2 className="text-xl font-semibold text-gray-900">{courseName}</h2>
                  <p className="text-sm text-gray-600">{courseNotes.length} notes</p>
                </div>
                <div className="p-6">
                  <div className="grid gap-4">
                    {courseNotes.map(note => (
                      <div key={note.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        {editingNote === note.id ? (
                          <div className="space-y-3">
                            <Input
                              placeholder="Note title"
                              value={editForm.title}
                              onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                            />
                            <textarea
                              placeholder="Note content"
                              value={editForm.content}
                              onChange={(e) => setEditForm(prev => ({ ...prev, content: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                              rows="4"
                            />
                            <div className="flex justify-end gap-2">
                              <Button
                                onClick={handleCancelEdit}
                                className="bg-gray-100 text-gray-700 hover:bg-gray-200"
                              >
                                Cancel
                              </Button>
                              <Button
                                onClick={handleSaveEdit}
                                className="bg-primary text-white hover:bg-primary-dark"
                              >
                                Save
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  {note.lessonName && (
                                    <span className="text-sm font-medium text-gray-900">
                                      {note.lessonName}
                                    </span>
                                  )}
                                  {note.timestamp && (
                                    <span className="text-sm text-blue-600 font-mono">
                                      {formatTimestamp(note.timestamp)}
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {formatDate(note.createdAt)}
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                <Button
                                  onClick={() => handleEditNote(note)}
                                  className="p-1 hover:bg-gray-100 rounded"
                                  icon={<ApperIcon name="Edit2" size={14} className="text-gray-500" />}
                                />
                                <Button
                                  onClick={() => handleDeleteNote(note.id)}
                                  className="p-1 hover:bg-gray-100 rounded"
                                  icon={<ApperIcon name="Trash2" size={14} className="text-red-500" />}
                                />
                              </div>
                            </div>
                            {note.title && (
                              <h4 className="font-medium text-gray-900 mb-2">{note.title}</h4>
                            )}
                            <p className="text-gray-700 leading-relaxed">{note.content}</p>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesPage;