import { useState } from 'react';

interface Note {
  id: number;
  text: string;
  color: string;
}

export const QuickNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [selectedColor, setSelectedColor] = useState('yellow');

  const colors = {
    yellow: 'bg-yellow-100 border-yellow-200',
    blue: 'bg-blue-100 border-blue-200',
    green: 'bg-green-100 border-green-200',
    pink: 'bg-pink-100 border-pink-200',
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      setNotes([
        ...notes,
        {
          id: Date.now(),
          text: newNote.trim(),
          color: selectedColor,
        },
      ]);
      setNewNote('');
      setIsAdding(false);
    }
  };

  const handleDeleteNote = (id: number) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="ml-5">
              <h3 className="text-lg font-medium text-gray-900">Quick Notes</h3>
            </div>
          </div>
          <button
            onClick={() => setIsAdding(true)}
            className="px-3 py-1 rounded-md text-sm font-medium bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
          >
            Add Note
          </button>
        </div>

        {isAdding && (
          <div className="mb-4">
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="Type your note here..."
              rows={3}
            />
            <div className="mt-2 flex justify-between items-center">
              <div className="flex space-x-2">
                {Object.entries(colors).map(([color, className]) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-6 h-6 rounded-full border-2 ${className} ${
                      selectedColor === color ? 'ring-2 ring-offset-2 ring-indigo-500' : ''
                    }`}
                  />
                ))}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsAdding(false)}
                  className="px-3 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddNote}
                  className="px-3 py-1 rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {notes.map((note) => (
            <div
              key={note.id}
              className={`p-3 rounded-md border ${colors[note.color as keyof typeof colors]}`}
            >
              <div className="flex justify-between items-start">
                <p className="text-gray-900">{note.text}</p>
                <button
                  onClick={() => handleDeleteNote(note.id)}
                  className="ml-2 text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 