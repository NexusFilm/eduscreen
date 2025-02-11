import React, { useState, useRef, useEffect } from 'react';
import { Timer } from './components/widgets/Timer';
import { QuickNotes } from './components/widgets/QuickNotes';
import { ColorTheme } from './components/widgets/ColorTheme';
import { Calculator } from './components/widgets/Calculator';
import { DraggableWidget } from './components/DraggableWidget';
import { TabScreen } from './components/Whiteboard/TabScreen';
import { YouTubePlayerWidget } from './components/widgets/YouTubePlayerWidget';
import { YouTubePlayerFixed } from './components/widgets/YouTubePlayerFixed';
import './App.css';

interface Position {
  x: number;
  y: number;
}

interface Widget {
  id: string;
  type: 'timer' | 'notes' | 'youtube' | 'calculator';
  position?: Position;
  label?: string;
  isCore?: boolean;
  size?: '1x1' | '1x2' | '2x1' | '2x2';
}

interface ThemeColor {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
}

const themeColors: ThemeColor[] = [
  {
    name: 'ocean',
    primary: '#4F46E5',
    secondary: '#818CF8',
    accent: '#6EE7B7'
  },
  {
    name: 'sunset',
    primary: '#F97316',
    secondary: '#FB923C',
    accent: '#FBBF24'
  },
  {
    name: 'forest',
    primary: '#059669',
    secondary: '#34D399',
    accent: '#A7F3D0'
  },
  {
    name: 'berry',
    primary: '#DB2777',
    secondary: '#EC4899',
    accent: '#F9A8D4'
  },
  {
    name: 'dark',
    primary: '#6366F1',
    secondary: '#818CF8',
    accent: '#34D399'
  },
  {
    name: 'minimal',
    primary: '#475569',
    secondary: '#64748B',
    accent: '#94A3B8'
  }
];

// Define which widgets can have multiple instances
const MULTI_INSTANCE_WIDGETS = ['timer', 'notes'];

// Define core widgets that should be present by default
const CORE_WIDGETS: Widget[] = [
  { 
    id: 'youtube-1', 
    type: 'youtube', 
    isCore: true, 
    label: 'YouTube Player',
    size: '2x2'
  },
  { 
    id: 'timer-1', 
    type: 'timer', 
    isCore: true, 
    label: 'Class Timer',
    size: '1x1'
  },
  {
    id: 'calculator-1',
    type: 'calculator',
    isCore: true,
    label: 'Calculator',
    size: '1x2'
  }
];

interface Class {
  id: string;
  name: string;
  theme: string;
  widgets: Widget[];
}

const INITIAL_WIDGETS: Widget[] = [
  { id: '1', type: 'timer', label: 'Timer', size: '1x1', position: { x: 20, y: 20 } },
  { id: '2', type: 'notes', label: 'Quick Notes', size: '1x2', position: { x: 400, y: 20 } },
  { id: '3', type: 'calculator', label: 'Calculator', size: '1x1', position: { x: 20, y: 300 } },
];

function App() {
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [widgets, setWidgets] = useState<Widget[]>(INITIAL_WIDGETS);
  const [classes, setClasses] = useState<Class[]>([
    {
      id: '1',
      name: 'Math Class',
      theme: 'ocean',
      widgets: CORE_WIDGETS
    }
  ]);
  const [currentClass, setCurrentClass] = useState<Class>(classes[0]);
  const [isEditingClassName, setIsEditingClassName] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isClassMenuOpen, setIsClassMenuOpen] = useState(false);
  const [userProfilePicture, setUserProfilePicture] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Debug logging
  console.log('App State:', {
    widgets,
    isAddingWidget: false,
    currentClass,
    isEditingClassName,
    isAuthenticated,
    isProfileMenuOpen
  });

  useEffect(() => {
    console.log('Core Widgets Loaded:', CORE_WIDGETS);
    console.log('Current Theme:', currentClass.theme);
  }, []);

  // Update widget positions when window resizes
  useEffect(() => {
    const handleResize = () => {
      setWidgets(prev => prev.map(widget => {
        if (widget.id === 'youtube-1') {
          return { ...widget, position: { x: 20, y: 120 } };
        }
        if (widget.id === 'timer-1') {
          return { ...widget, position: { x: 420, y: 120 } };
        }
        return widget;
      }));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleAddWidget = (type: string) => {
    const count = widgets.filter(w => w.type === type).length + 1;
    const newWidget: Widget = {
      id: `${type}-${count}`,
      type: type as Widget['type'],
      position: { x: 0, y: 0 },
      label: `${type} ${count}`,
      size: type === 'youtube' ? '1x2' : '1x1'
    };

    setWidgets(prev => {
      const updated = [...prev, newWidget];
      // Update class widgets
      setClasses(prevClasses => 
        prevClasses.map(c => 
          c.id === currentClass.id 
            ? { ...c, widgets: updated }
            : c
        )
      );
      return updated;
    });
  };

  const handlePositionChange = (id: string, position: Position) => {
    if (!isCustomizing) return;
    
    setWidgets(prevWidgets =>
      prevWidgets.map(widget =>
        widget.id === id ? { ...widget, position } : widget
      )
    );
  };

  const removeWidget = (id: string) => {
    const widget = widgets.find(w => w.id === id);
    if (widget?.isCore) return;
    
    setWidgets(prev => {
      const updated = prev.filter(w => w.id !== id);
      // Update class widgets
      setClasses(prevClasses => 
        prevClasses.map(c => 
          c.id === currentClass.id 
            ? { ...c, widgets: updated }
            : c
        )
      );
      return updated;
    });
  };

  const reorderWidgets = (startIndex: number, endIndex: number) => {
    setWidgets(prev => {
      const updated = Array.from(prev);
      const [removed] = updated.splice(startIndex, 1);
      updated.splice(endIndex, 0, removed);
      
      // Update class widgets
      setClasses(prevClasses => 
        prevClasses.map(c => 
          c.id === currentClass.id 
            ? { ...c, widgets: updated }
            : c
        )
      );
      return updated;
    });
  };

  const switchClass = (classId: string) => {
    const newClass = classes.find(c => c.id === classId);
    if (newClass) {
      setCurrentClass(newClass);
      setWidgets(newClass.widgets);
      setIsClassMenuOpen(false);
    }
  };

  const addClass = () => {
    const newClass: Class = {
      id: Date.now().toString(),
      name: `Class ${classes.length + 1}`,
      theme: 'ocean',
      widgets: CORE_WIDGETS
    };
    setClasses(prev => [...prev, newClass]);
    switchClass(newClass.id);
  };

  const toggleCustomizeMode = () => {
    setIsCustomizing(!isCustomizing);
  };

  const handleSwapWidgets = (sourceId: string, targetId: string) => {
    setWidgets(prevWidgets => {
      const newWidgets = [...prevWidgets];
      const sourceIndex = newWidgets.findIndex(w => w.id === sourceId);
      const targetIndex = newWidgets.findIndex(w => w.id === targetId);
      
      if (sourceIndex !== -1 && targetIndex !== -1) {
        [newWidgets[sourceIndex], newWidgets[targetIndex]] = 
        [newWidgets[targetIndex], newWidgets[sourceIndex]];
      }
      
      return newWidgets;
    });
  };

  const renderWidget = (widget: Widget) => {
    const getWidgetComponent = () => {
      switch (widget.type) {
        case 'timer':
          return <Timer label={widget.label} />;
        case 'notes':
          return <QuickNotes />;
        case 'calculator':
          return <Calculator label={widget.label} />;
        case 'youtube':
          return <YouTubePlayerWidget label={widget.label} />;
        default:
          return null;
      }
    };

    return (
      <DraggableWidget
        key={widget.id}
        id={widget.id}
        title={widget.label || widget.type}
        size={widget.size}
        canRemove={!widget.isCore}
        onRemove={() => removeWidget(widget.id)}
        classId={currentClass?.id || ''}
        isCustomizing={isCustomizing}
        onPositionChange={handlePositionChange}
        initialPosition={widget.position}
      >
        {getWidgetComponent()}
      </DraggableWidget>
    );
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md relative z-50 h-[var(--header-height)]">
        <div className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <h1 className="ml-2 text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">
                  EduScreen
                </h1>
              </div>

              {/* Class Switcher */}
              {isAuthenticated && (
                <div className="relative">
                  <button
                    onClick={() => setIsClassMenuOpen(!isClassMenuOpen)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg
                      text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <span>{currentClass.name}</span>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isClassMenuOpen && (
                    <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                      <div className="py-1">
                        {classes.map(c => (
                          <button
                            key={c.id}
                            onClick={() => switchClass(c.id)}
                            className={`block w-full text-left px-4 py-2 text-sm
                              ${c.id === currentClass.id ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`}
                          >
                            {c.name}
                          </button>
                        ))}
                        <button
                          onClick={addClass}
                          className="block w-full text-left px-4 py-2 text-sm text-indigo-600 hover:bg-gray-50"
                        >
                          + Add New Class
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {!isAuthenticated ? (
                <button
                  onClick={() => setIsAuthenticated(true)}
                  className="flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200"
                >
                  Sign In
                </button>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center space-x-2 rounded-full bg-white p-1 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {userProfilePicture ? (
                      <img
                        className="h-8 w-8 rounded-full object-cover"
                        src={userProfilePicture}
                        alt="User profile"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                        <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                  </button>

                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Change Profile Picture
                        <input
                          type="file"
                          ref={fileInputRef}
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setUserProfilePicture(reader.result as string);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </button>
                      <button
                        onClick={() => setIsAuthenticated(false)}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Theme Selector */}
      <div className="bg-white border-b border-gray-200 h-[var(--theme-selector-height)]">
        <ColorTheme 
          currentClass={currentClass}
          onThemeChange={(theme) => {
            setCurrentClass(prev => ({ ...prev, theme }));
          }}
        />
      </div>

      {/* Main Content */}
      <div className="main-layout">
        {/* Whiteboard Area */}
        <div className="whiteboard-area">
          <TabScreen />
        </div>

        {/* Fixed YouTube Section */}
        <div className="youtube-section">
          <YouTubePlayerFixed />
        </div>

        {/* Widget Section */}
        <div className="widget-section">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Widgets</h2>
            <div className="flex items-center gap-2">
              {isCustomizing && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAddWidget('timer')}
                    className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg"
                  >
                    Add Timer
                  </button>
                  <button
                    onClick={() => handleAddWidget('notes')}
                    className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg"
                  >
                    Add Notes
                  </button>
                  <button
                    onClick={() => handleAddWidget('calculator')}
                    className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg"
                  >
                    Add Calculator
                  </button>
                </div>
              )}
              <button
                onClick={toggleCustomizeMode}
                className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                  isCustomizing 
                    ? 'bg-primary-color text-white' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {isCustomizing ? 'Save Layout' : 'Customize'}
              </button>
            </div>
          </div>
          <div className="widget-grid">
            {widgets.map(renderWidget)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
