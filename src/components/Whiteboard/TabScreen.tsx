import React, { useState, useRef } from 'react';
import { DocumentEditor } from './DocumentEditor';

interface Tab {
  id: string;
  title: string;
  isActive: boolean;
  files: Array<{
    id: string;
    name: string;
    type: string;
    url: string;
    content?: string;
  }>;
}

interface Document {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
}

export const TabScreen = () => {
  const [tabs, setTabs] = useState<Tab[]>([
    { id: '1', title: 'Screen 1', isActive: true, files: [] }
  ]);
  const [isCreatingDocument, setIsCreatingDocument] = useState(false);
  const [editingDocument, setEditingDocument] = useState<{id: string, content: string} | null>(null);
  const [editingTabId, setEditingTabId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [documentTitle, setDocumentTitle] = useState('Untitled Document');
  const [selectedImage, setSelectedImage] = useState<{url: string, name: string} | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleNewDocument = () => {
    setDocumentTitle('Untitled Document');
    setEditingDocument(null);
    setIsEditorOpen(true);
  };

  const handleEditDocument = (file: { id: string, content?: string, name?: string }) => {
    if (file.content) {
      setEditingDocument({ id: file.id, content: file.content });
      setDocumentTitle(file.name || 'Untitled Document');
      setIsEditorOpen(true);
    }
  };

  const handleSaveDocument = (content: string) => {
    if (editingDocument) {
      // Update existing document
      setTabs(prevTabs => prevTabs.map(tab => {
        if (tab.isActive) {
          return {
            ...tab,
            files: tab.files.map(file => 
              file.id === editingDocument.id 
                ? { ...file, content, name: documentTitle }
                : file
            )
          };
        }
        return tab;
      }));
    } else {
      // Create new document
      const newDoc = {
        id: Date.now().toString(),
        name: documentTitle,
        type: 'text/html',
        url: '#',
        content: content
      };

      setTabs(prevTabs => prevTabs.map(tab => 
        tab.isActive 
          ? { ...tab, files: [...tab.files, newDoc] }
          : tab
      ));
    }
    setIsEditorOpen(false);
    setEditingDocument(null);
    setIsCreatingDocument(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newFiles = files.map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.type,
        url: URL.createObjectURL(file)
      }));

      setTabs(prevTabs => prevTabs.map(tab => 
        tab.isActive ? { ...tab, files: [...tab.files, ...newFiles] } : tab
      ));
    }
  };

  const addNewTab = () => {
    const newTab: Tab = {
      id: Math.random().toString(36).substr(2, 9),
      title: `Screen ${tabs.length + 1}`,
      isActive: false,
      files: []
    };

    setTabs(prevTabs => {
      const updatedTabs = prevTabs.map(tab => ({
        ...tab,
        isActive: false
      }));
      return [...updatedTabs, { ...newTab, isActive: true }];
    });
  };

  const switchTab = (tabId: string) => {
    setTabs(prevTabs =>
      prevTabs.map(tab => ({
        ...tab,
        isActive: tab.id === tabId
      }))
    );
  };

  const handleTabTitleChange = (tabId: string, newTitle: string) => {
    setTabs(prevTabs =>
      prevTabs.map(tab =>
        tab.id === tabId ? { ...tab, title: newTitle } : tab
      )
    );
    setEditingTabId(null);
  };

  const removeTab = (tabId: string) => {
    setTabs(prevTabs => {
      const filteredTabs = prevTabs.filter(tab => tab.id !== tabId);
      if (filteredTabs.length === 0) {
        return [{ id: '1', title: 'Screen 1', isActive: true, files: [] }];
      }
      if (prevTabs.find(tab => tab.id === tabId)?.isActive) {
        filteredTabs[filteredTabs.length - 1].isActive = true;
      }
      return filteredTabs;
    });
  };

  const getDocumentPreview = (content: string) => {
    const titleMatch = content.match(/<h1 class="document-title">(.*?)<\/h1>/);
    const title = titleMatch ? titleMatch[1] : 'Untitled Document';
    
    const plainText = content
      .replace(/<h1 class="document-title">.*?<\/h1>/, '')
      .replace(/<[^>]*>/g, '')
      .trim();

    const preview = plainText.length > 100 ? plainText.slice(0, 100) + '...' : plainText;

    return {
      title,
      preview
    };
  };

  const activeTab = tabs.find(tab => tab.isActive);
  const hasContent = activeTab && activeTab.files.length > 0;

  const handleImageClick = (file: { url: string, name: string, type: string, id: string }) => {
    if (file.type.startsWith('image/')) {
      setSelectedImage(file);
      setZoomLevel(1);
    }
  };

  const renderImageViewer = () => {
    if (!selectedImage) return null;

    return (
      <div 
        className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
        onClick={() => setSelectedImage(null)}
      >
        <div className="absolute top-4 right-4 flex gap-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setZoomLevel(prev => Math.min(prev + 0.25, 3));
            }}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setZoomLevel(prev => Math.max(prev - 0.25, 0.25));
            }}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setZoomLevel(1);
            }}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>
          <a
            href={selectedImage.url}
            download={selectedImage.name}
            onClick={e => e.stopPropagation()}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </a>
        </div>
        <img
          src={selectedImage.url}
          alt={selectedImage.name}
          style={{ 
            transform: `scale(${zoomLevel})`,
            maxHeight: '90vh',
            maxWidth: '90vw',
            objectFit: 'contain',
            transition: 'transform 0.2s ease-in-out'
          }}
          className="rounded-lg"
        />
      </div>
    );
  };

  return (
    <div className="h-full rounded-xl overflow-hidden flex flex-col"
      style={{
        background: `linear-gradient(to bottom, var(--background-color), var(--surface-color))`
      }}
    >
      {/* Tab Bar */}
      <div className="flex items-center px-4 py-2"
        style={{
          background: 'var(--surface-color)',
          borderBottom: '1px solid var(--border-color)'
        }}
      >
        <div className="flex-1 flex items-center space-x-2 overflow-x-auto">
          {tabs.map(tab => (
            <div
              key={tab.id}
              className={`group flex items-center px-4 py-2 rounded-lg cursor-pointer transition-colors duration-200`}
              style={{
                background: tab.isActive ? 'var(--primary-color)' : 'transparent',
                color: tab.isActive ? '#FFFFFF' : 'var(--text-color)'
              }}
              onClick={() => switchTab(tab.id)}
            >
              {editingTabId === tab.id ? (
                <input
                  type="text"
                  value={tab.title}
                  onChange={(e) => handleTabTitleChange(tab.id, e.target.value)}
                  onBlur={() => setEditingTabId(null)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleTabTitleChange(tab.id, e.currentTarget.value);
                    }
                  }}
                  className="bg-transparent border-none focus:outline-none focus:ring-0 w-24 text-inherit"
                  style={{ color: 'inherit' }}
                  autoFocus
                />
              ) : (
                <>
                  <span
                    onDoubleClick={() => setEditingTabId(tab.id)}
                    className="truncate max-w-[120px]"
                  >
                    {tab.title}
                  </span>
                  {tabs.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeTab(tab.id);
                      }}
                      className="ml-2 p-1 rounded-full opacity-0 group-hover:opacity-100
                        transition-opacity duration-200"
                      style={{
                        background: tab.isActive ? 'rgba(255, 255, 255, 0.1)' : 'var(--hover-color)'
                      }}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
        
        <button
          onClick={addNewTab}
          className="ml-2 p-2 rounded-lg transition-colors duration-200 hover:bg-opacity-10"
          style={{
            color: 'var(--text-color)',
            background: 'transparent'
          }}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* Action Bar */}
      <div className="px-4 py-3 border-b flex items-center justify-between bg-white"
        style={{
          borderColor: 'var(--border-color)'
        }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={handleNewDocument}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white
              transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]
              shadow-sm hover:shadow-md"
            style={{
              background: 'var(--primary-color)',
            }}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="font-medium">New Document</span>
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg
              transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]
              shadow-sm hover:shadow-md border"
            style={{
              background: 'white',
              color: 'var(--primary-color)',
              borderColor: 'var(--primary-color)'
            }}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <span className="font-medium">Upload Files</span>
          </button>
        </div>
        {activeTab && activeTab.files.length > 0 && (
          <div className="text-sm text-gray-500">
            {activeTab.files.length} {activeTab.files.length === 1 ? 'file' : 'files'}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        {!hasContent ? (
          <div className="h-full flex flex-col items-center justify-center p-8">
            <div className="w-full max-w-3xl mx-auto text-center">
              <div className="rounded-2xl shadow-xl p-12 backdrop-blur-sm"
                style={{
                  background: 'var(--surface-color)',
                  color: 'var(--text-color)'
                }}
              >
                <div className="max-w-md mx-auto">
                  <h2 className="text-3xl font-bold mb-4"
                    style={{ color: 'var(--text-color)' }}
                  >
                    Add content to get started
                  </h2>
                  <p className="text-lg mb-8"
                    style={{ color: 'var(--text-color)' }}
                  >
                    Create a new document or upload existing files to begin
                  </p>
                  
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4">
                    <button
                      onClick={handleNewDocument}
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center px-8 py-4 
                        text-lg font-semibold rounded-xl
                        transform transition-all duration-200
                        hover:scale-105 active:scale-95 shadow-md hover:shadow-xl"
                      style={{
                        background: 'var(--primary-color)',
                        color: '#FFFFFF'
                      }}
                    >
                      <svg className="w-6 h-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h10a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      New Document
                    </button>

                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center px-8 py-4
                        text-lg font-semibold rounded-xl border-2
                        transform transition-all duration-200
                        hover:scale-105 active:scale-95 shadow-md hover:shadow-xl"
                      style={{
                        background: 'var(--surface-color)',
                        color: 'var(--text-color)',
                        borderColor: 'var(--border-color)'
                      }}
                    >
                      <svg className="w-6 h-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      Upload Files
                    </button>
                  </div>

                  <div className="mt-8 text-sm"
                    style={{ color: 'var(--text-color)' }}
                  >
                    Supported formats: Images, PDFs, and Documents
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full overflow-y-auto p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-fr">
              {activeTab?.files.map(file => (
                <div
                  key={file.id}
                  className="relative group rounded-lg shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer
                    transform hover:scale-[1.02] hover:rotate-[0.5deg]"
                  style={{
                    background: 'var(--surface-color)',
                    color: 'var(--text-color)'
                  }}
                  onClick={() => file.type.startsWith('image/') ? handleImageClick(file) : handleEditDocument(file)}
                >
                  {file.type === 'text/html' ? (
                    <div 
                      className="w-full h-32 p-4 overflow-hidden rounded-t-lg relative group"
                      style={{ background: 'var(--hover-color)' }}
                    >
                      <div className="text-sm space-y-2"
                        style={{ color: 'var(--text-color)' }}
                      >
                        {file.content && (
                          <>
                            <h4 className="font-medium">
                              {getDocumentPreview(file.content).title}
                            </h4>
                            <p className="line-clamp-3 text-gray-600">
                              {getDocumentPreview(file.content).preview}
                            </p>
                          </>
                        )}
                      </div>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 
                        transition-colors duration-200 flex items-center justify-center opacity-0 
                        group-hover:opacity-100">
                        <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full
                          shadow-lg transform translate-y-2 group-hover:translate-y-0 
                          transition-all duration-200">
                          <span className="text-sm font-medium text-gray-700">Click to edit</span>
                        </div>
                      </div>
                    </div>
                  ) : file.type.startsWith('image/') ? (
                    <img
                      src={file.url}
                      alt={file.name}
                      className="w-full h-32 object-cover rounded-t-lg"
                    />
                  ) : (
                    <div className="w-full h-32 flex items-center justify-center rounded-t-lg"
                      style={{ background: 'var(--hover-color)' }}
                    >
                      <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                        style={{ color: 'var(--text-color)' }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  )}
                  <div className="p-3">
                    <p className="text-sm font-medium truncate"
                      style={{ color: 'var(--text-color)' }}
                    >
                      {file.name}
                    </p>
                    <div className="mt-2 flex justify-between">
                      <a
                        href={file.url}
                        download={file.name}
                        className="text-xs hover:opacity-80"
                        style={{ color: 'var(--primary-color)' }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        Download
                      </a>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setTabs(prevTabs => prevTabs.map(t => 
                            t.id === activeTab?.id
                              ? { ...t, files: t.files.filter(f => f.id !== file.id) }
                              : t
                          ));
                        }}
                        className="text-xs hover:opacity-80"
                        style={{ color: 'var(--accent-color)' }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Image Viewer Modal */}
      {renderImageViewer()}

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileSelect}
        multiple
        accept="image/*,.pdf,.doc,.docx"
      />

      {/* Document Editor Modal */}
      {isEditorOpen && (
        <DocumentEditor
          title={documentTitle}
          onTitleChange={setDocumentTitle}
          initialContent={editingDocument?.content || ''}
          onSave={handleSaveDocument}
          onClose={() => {
            setIsEditorOpen(false);
            setEditingDocument(null);
          }}
        />
      )}
    </div>
  );
}; 