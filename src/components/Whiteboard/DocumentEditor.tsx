import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import FontFamily from '@tiptap/extension-font-family';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Underline from '@tiptap/extension-underline';
import html2pdf from 'html2pdf.js';

interface DocumentEditorProps {
  initialContent: string;
  onSave: (content: string) => void;
  onClose: () => void;
  title: string;
  onTitleChange: (title: string) => void;
}

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export const DocumentEditor: React.FC<DocumentEditorProps> = ({
  initialContent,
  onSave,
  onClose,
  title,
  onTitleChange
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeHeading, setActiveHeading] = useState<HeadingLevel | 0>(0);
  const [activeFont, setActiveFont] = useState('Arial');
  const [activeAlign, setActiveAlign] = useState('left');
  const [localContent, setLocalContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Initialize editor with clean content (remove any existing title)
  const cleanInitialContent = initialContent.replace(/<h1 class="document-title">.*?<\/h1>/, '').trim();

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      FontFamily,
      TextStyle,
      Color,
      Underline
    ],
    content: cleanInitialContent,
    autofocus: 'end',
    onUpdate: ({ editor }) => {
      setHasUnsavedChanges(true);
      setLocalContent(editor.getHTML());
    },
  });

  // Auto-save functionality
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (hasUnsavedChanges && editor) {
        handleSave();
      }
    }, 30000); // Auto-save every 30 seconds if there are changes

    return () => clearInterval(autoSaveInterval);
  }, [hasUnsavedChanges, editor]);

  // Handle keyboard shortcuts
  useEffect(() => {
    if (editor) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 's') {
          e.preventDefault();
          handleSave();
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [editor]);

  const fonts = [
    'Arial',
    'Times New Roman',
    'Courier New',
    'Georgia',
    'Verdana',
    'Helvetica'
  ];

  const headingLevels = [
    { label: 'Normal', value: 0 },
    { label: 'Heading 1', value: 1 as HeadingLevel },
    { label: 'Heading 2', value: 2 as HeadingLevel },
    { label: 'Heading 3', value: 3 as HeadingLevel },
    { label: 'Heading 4', value: 4 as HeadingLevel }
  ];

  const handleSave = async () => {
    if (!editor || isSaving) return;

    try {
      setIsSaving(true);
      const content = editor.getHTML();
      onSave(content);
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Error saving document:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!editor) return;

    const content = `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
        <h1 style="font-size: 24px; margin-bottom: 1em; color: #1a1a1a;">${title}</h1>
        ${editor.getHTML()}
      </div>
    `;
    
    const opt = {
      margin: [10, 10],
      filename: `${title}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
      await html2pdf().set(opt).from(content).save();
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  // Prompt user before closing if there are unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const handleClose = () => {
    if (hasUnsavedChanges) {
      const shouldClose = window.confirm('You have unsaved changes. Are you sure you want to close?');
      if (!shouldClose) return;
    }
    onClose();
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-gray-100">
      <div className="h-full flex flex-col bg-white max-w-5xl mx-auto shadow-xl">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-4 py-2 border-b bg-white">
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="text-xl font-medium bg-transparent border-none outline-none focus:ring-2 focus:ring-indigo-500 rounded px-2 py-1"
            placeholder="Untitled Document"
          />
          <div className="flex items-center space-x-2">
            {hasUnsavedChanges && (
              <span className="text-sm text-gray-500">
                {isSaving ? 'Saving...' : 'Unsaved changes'}
              </span>
            )}
            <button
              onClick={handleDownloadPDF}
              className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              Download PDF
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || !hasUnsavedChanges}
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={handleClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="border-b bg-white p-2 flex items-center space-x-4">
          {/* Font Family */}
          <select
            value={activeFont}
            onChange={(e) => {
              setActiveFont(e.target.value);
              editor.chain().focus().setFontFamily(e.target.value).run();
            }}
            className="px-2 py-1 border rounded-md"
          >
            {fonts.map(font => (
              <option key={font} value={font}>{font}</option>
            ))}
          </select>

          {/* Heading Levels */}
          <select
            value={activeHeading}
            onChange={(e) => {
              const value = parseInt(e.target.value) as HeadingLevel | 0;
              setActiveHeading(value);
              if (value === 0) {
                editor.chain().focus().setParagraph().run();
              } else {
                editor.chain().focus().toggleHeading({ level: value }).run();
              }
            }}
            className="px-2 py-1 border rounded-md"
          >
            {headingLevels.map(level => (
              <option key={level.value} value={level.value}>{level.label}</option>
            ))}
          </select>

          {/* Text Formatting */}
          <div className="flex items-center space-x-1 border-l pl-4">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('bold') ? 'bg-gray-100' : ''}`}
              title="Bold (⌘+B)"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12h8a4 4 0 100-8H6v8zm0 0h8a4 4 0 110 8H6v-8z" />
              </svg>
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('italic') ? 'bg-gray-100' : ''}`}
              title="Italic (⌘+I)"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </button>
            <button
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('underline') ? 'bg-gray-100' : ''}`}
              title="Underline (⌘+U)"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>

          {/* Text Alignment */}
          <div className="flex items-center space-x-1 border-l pl-4">
            <button
              onClick={() => {
                setActiveAlign('left');
                editor.chain().focus().setTextAlign('left').run();
              }}
              className={`p-2 rounded hover:bg-gray-100 ${activeAlign === 'left' ? 'bg-gray-100' : ''}`}
              title="Align Left"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h16" />
              </svg>
            </button>
            <button
              onClick={() => {
                setActiveAlign('center');
                editor.chain().focus().setTextAlign('center').run();
              }}
              className={`p-2 rounded hover:bg-gray-100 ${activeAlign === 'center' ? 'bg-gray-100' : ''}`}
              title="Center"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M7 12h10M4 18h16" />
              </svg>
            </button>
            <button
              onClick={() => {
                setActiveAlign('right');
                editor.chain().focus().setTextAlign('right').run();
              }}
              className={`p-2 rounded hover:bg-gray-100 ${activeAlign === 'right' ? 'bg-gray-100' : ''}`}
              title="Align Right"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M10 12h10M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Editor Content */}
        <div className="flex-1 overflow-y-auto bg-gray-100">
          <div className="max-w-[850px] mx-auto my-8">
            <div className="min-h-[1056px] bg-white shadow-sm">
              <div className="h-full px-12 py-8">
                <EditorContent 
                  editor={editor} 
                  className="prose max-w-none min-h-full outline-none [&>*:first-child]:mt-0 [&>*]:text-gray-700"
                />
              </div>
            </div>
            <div className="h-8" aria-hidden="true" /> {/* Bottom spacing */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentEditor; 