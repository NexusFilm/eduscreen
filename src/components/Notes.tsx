import React, { useState } from 'react';

interface NotesProps {
  id: string;
  onRemove: () => void;
  className: string;
}

const Notes: React.FC<NotesProps> = ({ id, onRemove, className }) => {
  const [notes, setNotes] = useState<string[]>([]);
  const [currentNote, setCurrentNote] = useState('');

  const handleAddNote = () => {
    if (currentNote.trim()) {
      setNotes(prev => [...prev, currentNote.trim()]);
      setCurrentNote('');
    }
  };

  const handleRemoveNote = (index: number) => {
    setNotes(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className={className}>
      <div className="widget-header">
        <h3>Quick Notes</h3>
        <button onClick={onRemove} className="remove-widget">×</button>
      </div>
      <div className="widget-content notes-content">
        <div className="notes-input">
          <input
            type="text"
            value={currentNote}
            onChange={(e) => setCurrentNote(e.target.value)}
            placeholder="Add a note..."
            onKeyPress={(e) => e.key === 'Enter' && handleAddNote()}
          />
          <button onClick={handleAddNote}>Add</button>
        </div>
        <div className="notes-list">
          {notes.map((note, index) => (
            <div key={index} className="note-item">
              <span>{note}</span>
              <button onClick={() => handleRemoveNote(index)}>×</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notes; 