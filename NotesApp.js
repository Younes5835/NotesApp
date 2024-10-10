import React, { useState } from 'react';
import { Home, Archive, Trash2, Search, Star, Edit } from 'lucide-react';

const BookLogo = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 5V27H25V5H7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 5H25" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M7 27H25" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M11 9H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M11 13H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M11 17H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const NoteApp = () => {
  const [notes, setNotes] = useState([]);
  const [currentView, setCurrentView] = useState('notes');
  const [searchTerm, setSearchTerm] = useState('');
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [editingNote, setEditingNote] = useState(null);

  const MenuItem = ({ icon: Icon, children, onClick }) => (
    <li className="flex items-center space-x-2 py-2 px-4 hover:bg-gray-700 rounded cursor-pointer" onClick={onClick}>
      <Icon size={20} />
      <span>{children}</span>
    </li>
  );

  const addOrUpdateNote = () => {
    if (editingNote) {
      setNotes(notes.map(note => 
        note.id === editingNote.id 
          ? { ...note, title: newNote.title, content: newNote.content, lastModified: Date.now() } 
          : note
      ));
      setEditingNote(null);
    } else if (newNote.title || newNote.content) {
      setNotes([...notes, { ...newNote, id: Date.now(), createdAt: Date.now(), lastModified: Date.now(), archived: false, favorite: false, inTrash: false }]);
    }
    setNewNote({ title: '', content: '' });
  };

  const editNote = (note) => {
    setEditingNote(note);
    setNewNote({ title: note.title, content: note.content });
  };

  const moveToTrash = (id) => {
    setNotes(notes.map(note => note.id === id ? { ...note, inTrash: true } : note));
  };

  const restoreFromTrash = (id) => {
    setNotes(notes.map(note => note.id === id ? { ...note, inTrash: false } : note));
  };

  const permanentlyDelete = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const toggleArchive = (id) => {
    setNotes(notes.map(note => note.id === id ? { ...note, archived: !note.archived } : note));
  };

  const toggleFavorite = (id) => {
    setNotes(notes.map(note => note.id === id ? { ...note, favorite: !note.favorite } : note));
  };

  const filteredNotes = notes.filter(note => {
    if (currentView === 'trash') return note.inTrash;
    if (currentView === 'archive') return note.archived && !note.inTrash;
    if (currentView === 'favorites') return note.favorite && !note.archived && !note.inTrash;
    return !note.archived && !note.inTrash;
  }).filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-900 text-gray-200">
      <aside className="w-64 p-4 bg-gray-800 border-r border-gray-700">
        <div className="flex items-center mb-6">
          <BookLogo />
          <h1 className="text-xl font-semibold ml-2">NoteApp</h1>
        </div>
        
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Recherche"
            className="w-full py-2 px-4 bg-gray-700 rounded-lg text-gray-200 placeholder-gray-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
        </div>
        
        <ul className="space-y-2">
          <MenuItem icon={Home} onClick={() => setCurrentView('notes')}>Accueil</MenuItem>
          <MenuItem icon={Star} onClick={() => setCurrentView('favorites')}>Favoris</MenuItem>
          <MenuItem icon={Archive} onClick={() => setCurrentView('archive')}>Archive</MenuItem>
          <MenuItem icon={Trash2} onClick={() => setCurrentView('trash')}>Corbeille</MenuItem>
        </ul>
      </aside>
      
      <main className="flex-1 p-8 bg-gray-900 overflow-auto">
        <div className="max-w-2xl mx-auto">
          <div className="p-4 rounded-lg mb-6 bg-gray-800 border border-gray-700">
            <input
              type="text"
              placeholder="Titre de la note"
              className="w-full bg-transparent outline-none text-gray-200 placeholder-gray-400 mb-2"
              value={newNote.title}
              onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
            />
            <textarea
              placeholder="Contenu de la note..."
              className="w-full bg-transparent outline-none text-gray-200 placeholder-gray-400 resize-none"
              rows="3"
              value={newNote.content}
              onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
            />
            <button 
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={addOrUpdateNote}
            >
              {editingNote ? 'Mettre à jour' : 'Ajouter'} la note
            </button>
          </div>
          
          {filteredNotes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredNotes.map(note => (
                <div key={note.id} className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                  <h3 className="text-lg font-semibold mb-2">{note.title}</h3>
                  <p className="text-gray-300">{note.content}</p>
                  <div className="mt-4 flex justify-end space-x-2">
                    {!note.inTrash && (
                      <>
                        <button onClick={() => editNote(note)} className="text-blue-400 hover:text-blue-300">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => toggleFavorite(note.id)} className={`${note.favorite ? 'text-yellow-400' : 'text-gray-400'} hover:text-yellow-300`}>
                          <Star size={16} />
                        </button>
                        <button onClick={() => toggleArchive(note.id)} className="text-green-400 hover:text-green-300">
                          {note.archived ? 'Désarchiver' : 'Archiver'}
                        </button>
                        <button onClick={() => moveToTrash(note.id)} className="text-red-400 hover:text-red-300">
                          Supprimer
                        </button>
                      </>
                    )}
                    {note.inTrash && (
                      <>
                        <button onClick={() => restoreFromTrash(note.id)} className="text-green-400 hover:text-green-300">
                          Restaurer
                        </button>
                        <button onClick={() => permanentlyDelete(note.id)} className="text-red-400 hover:text-red-300">
                          Supprimer définitivement
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center">
              <Home className="mx-auto mb-4 text-gray-500" size={48} />
              <p className="text-gray-500">Aucune note à afficher</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default NoteApp;