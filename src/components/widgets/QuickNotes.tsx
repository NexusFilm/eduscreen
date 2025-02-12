import { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

interface Note {
  id: number;
  text: string;
  color: 'yellow' | 'blue' | 'green';
}

interface DraggableNoteProps {
  note: Note;
  index: number;
  moveNote: (dragIndex: number, hoverIndex: number) => void;
  onDelete: (id: number) => void;
}

const DraggableNote: React.FC<DraggableNoteProps> = ({ note, index, moveNote, onDelete }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'note',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'note',
    hover: (item: { index: number }, monitor) => {
      if (!monitor.isOver({ shallow: true })) return;
      
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      moveNote(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const colors = {
    yellow: { bg: '#fef3c7', text: '#92400e', border: 'rgba(146, 64, 14, 0.2)' },
    blue: { bg: '#e0f2fe', text: '#075985', border: 'rgba(7, 89, 133, 0.2)' },
    green: { bg: '#dcfce7', text: '#166534', border: 'rgba(22, 101, 52, 0.2)' }
  };

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`relative mb-4 p-4 rounded-lg transition-all duration-200 cursor-move
        ${isDragging ? 'opacity-50' : 'hover:scale-[1.02]'}`}
      style={{
        background: colors[note.color].bg,
        color: colors[note.color].text,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        transform: `rotate(${index % 2 === 0 ? '-1deg' : '1deg'})`
      }}
    >
      <p className="text-lg whitespace-pre-wrap">{note.text}</p>
      <button
        onClick={() => onDelete(note.id)}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity
          hover:bg-black/10 rounded-full p-1"
        style={{ color: colors[note.color].text }}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export const QuickNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [selectedColor, setSelectedColor] = useState<'yellow' | 'blue' | 'green'>('yellow');

  const colors = {
    yellow: { bg: '#fef3c7', text: '#92400e', border: 'rgba(146, 64, 14, 0.2)' },
    blue: { bg: '#e0f2fe', text: '#075985', border: 'rgba(7, 89, 133, 0.2)' },
    green: { bg: '#dcfce7', text: '#166534', border: 'rgba(22, 101, 52, 0.2)' }
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      setNotes([
        ...notes,
        {
          id: Date.now(),
          text: newNote.trim(),
          color: selectedColor
        },
      ]);
      setNewNote('');
      setIsAdding(false);
    }
  };

  const handleDeleteNote = (id: number) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const moveNote = (dragIndex: number, hoverIndex: number) => {
    const dragNote = notes[dragIndex];
    setNotes(prevNotes => {
      const newNotes = [...prevNotes];
      newNotes.splice(dragIndex, 1);
      newNotes.splice(hoverIndex, 0, dragNote);
      return newNotes;
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-full flex flex-col">
        <div className="flex-1 overflow-y-auto p-4">
          {notes.map((note, index) => (
            <DraggableNote
              key={note.id}
              note={note}
              index={index}
              moveNote={moveNote}
              onDelete={handleDeleteNote}
            />
          ))}
        </div>

        <div className="p-4" style={{ borderTop: `1px dashed ${colors[selectedColor].border}` }}>
          {isAdding ? (
            <div className="space-y-3">
              <div className="flex gap-2 mb-3">
                {(Object.keys(colors) as Array<keyof typeof colors>).map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full transition-all duration-200 ${
                      selectedColor === color ? 'ring-2 ring-offset-2' : ''
                    }`}
                    style={{
                      background: colors[color].bg,
                      borderColor: colors[color].border,
                      transform: selectedColor === color ? 'scale(1.1)' : 'scale(1)'
                    }}
                  />
                ))}
              </div>
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="w-full p-3 rounded-lg resize-none focus:outline-none focus:ring-0"
                placeholder="Write your note here..."
                rows={3}
                autoFocus
                style={{
                  background: colors[selectedColor].bg,
                  color: colors[selectedColor].text,
                  borderColor: colors[selectedColor].border
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleAddNote();
                  }
                }}
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                  style={{ color: colors[selectedColor].text }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddNote}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                  style={{
                    background: `${colors[selectedColor].text}20`,
                    color: colors[selectedColor].text
                  }}
                >
                  Add Note
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAdding(true)}
              className="w-full p-3 rounded-lg text-left transition-all duration-200"
              style={{ color: colors[selectedColor].text }}
            >
              + Add a note...
            </button>
          )}
        </div>
      </div>
    </DndProvider>
  );
}; 