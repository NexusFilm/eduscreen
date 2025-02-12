import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Timer } from './components/widgets/Timer';
import { QuickNotes } from './components/widgets/QuickNotes';
import { ColorTheme } from './components/widgets/ColorTheme';
import { Calculator } from './components/widgets/Calculator';
import { DraggableWidget } from './components/DraggableWidget';
import { TabScreen } from './components/Whiteboard/TabScreen';
import { YouTubePlayerFixed } from './components/widgets/YouTubePlayerFixed';
import { YouTubeMusicPlayer } from './components/widgets/YouTubeMusicPlayer';
import SupabaseTest from './components/SupabaseTest';
import ConfigCheck from './components/ConfigCheck';
import './App.css';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import WidgetMenu from './components/WidgetMenu';
import { signInWithGoogle, signOut, getCurrentUser, User } from './lib/auth';

interface Position {
  x: number;
  y: number;
}

interface Widget {
  id: string;
  type: 'timer' | 'notes' | 'calculator';
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
  background: string;
  surface: string;
  text: string;
  border: string;
  hover: string;
}

interface Class {
  id: string;
  name: string;
  theme: string;
  widgets: Widget[];
}

const themeColors: ThemeColor[] = [
  {
    name: 'ocean',
    primary: '#4F46E5',
    secondary: '#818CF8',
    accent: '#6EE7B7',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    text: '#1E293B',
    border: '#E2E8F0',
    hover: '#F1F5F9'
  },
  {
    name: 'sunset',
    primary: '#F97316',
    secondary: '#FB923C',
    accent: '#FBBF24',
    background: '#FFF7ED',
    surface: '#FFFFFF',
    text: '#431407',
    border: '#FED7AA',
    hover: '#FFF3E7'
  },
  {
    name: 'forest',
    primary: '#059669',
    secondary: '#34D399',
    accent: '#A7F3D0',
    background: '#F0FDF4',
    surface: '#FFFFFF',
    text: '#064E3B',
    border: '#D1FAE5',
    hover: '#ECFDF5'
  },
  {
    name: 'berry',
    primary: '#DB2777',
    secondary: '#EC4899',
    accent: '#F9A8D4',
    background: '#FDF2F8',
    surface: '#FFFFFF',
    text: '#831843',
    border: '#FCE7F3',
    hover: '#FDF2F8'
  },
  {
    name: 'dark',
    primary: '#6366F1',
    secondary: '#818CF8',
    accent: '#34D399',
    background: '#0F172A',
    surface: '#1E293B',
    text: '#F8FAFC',
    border: '#334155',
    hover: '#1E293B'
  },
  {
    name: 'minimal',
    primary: '#475569',
    secondary: '#64748B',
    accent: '#94A3B8',
    background: '#FFFFFF',
    surface: '#F8FAFC',
    text: '#0F172A',
    border: '#E2E8F0',
    hover: '#F1F5F9'
  }
];

// Define which widgets can have multiple instances
const MULTI_INSTANCE_WIDGETS = ['timer', 'notes'];

// Define default sizes for each widget type
const WIDGET_DEFAULT_SIZES = {
  timer: '1x1',    // 350px × 500px
  notes: '1x1',    // 350px × 500px
  calculator: '1x1' // 350px × 500px
} as const;

// Define core widgets that should be present by default
const CORE_WIDGETS: Widget[] = [
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
    size: '1x1'
  },
  {
    id: 'notes-1',
    type: 'notes',
    isCore: true,
    label: 'Quick Notes',
    size: '1x1'
  }
];

const INITIAL_WIDGETS: Widget[] = [
  { 
    id: 'timer-1', 
    type: 'timer', 
    label: 'Timer', 
    size: '1x1',
    position: { x: 0, y: 0 }
  },
  { 
    id: 'notes-1', 
    type: 'notes', 
    label: 'Quick Notes', 
    size: '1x2',
    position: { x: 0, y: 0 }
  },
  { 
    id: 'calculator-1', 
    type: 'calculator', 
    label: 'Calculator', 
    size: '1x1',
    position: { x: 0, y: 0 }
  }
];

const getThemeColors = (t: string): ThemeColor => {
  return themeColors.find(theme => theme.name === t) || themeColors[0];
};

export default function App() {
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
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isWidgetMenuOpen, setIsWidgetMenuOpen] = useState(false);
  const [selectedWidgetType, setSelectedWidgetType] = useState<string | null>(null);
  const [showWidgetMenu, setShowWidgetMenu] = useState(false);

  // Calculate grid positions for widgets
  const calculateGridPosition = (index: number) => {
    const gridColumns = 2;
    const row = Math.floor(index / gridColumns);
    const col = index % gridColumns;
    
    return {
      x: col * 350,
      y: row * 500
    };
  };

  const handleAddWidget = (type: string) => {
    const newWidget: Widget = {
      id: `widget-${Date.now()}`,
      type: type as 'timer' | 'notes' | 'calculator',
      label: getWidgetTitle(type),
      size: WIDGET_DEFAULT_SIZES[type as keyof typeof WIDGET_DEFAULT_SIZES] || '1x1',
      position: calculateGridPosition(currentClass.widgets.length)
    };
    
    setClasses(prevClasses => 
      prevClasses.map(c => 
        c.id === currentClass.id 
          ? { ...c, widgets: [...c.widgets, newWidget] }
          : c
      )
    );
    setCurrentClass(prev => ({
      ...prev,
      widgets: [...prev.widgets, newWidget]
    }));
  };

  const getWidgetTitle = (type: string): string => {
    switch (type) {
      case 'timer':
        return 'Timer';
      case 'notes':
        return 'Quick Notes';
      case 'calculator':
        return 'Calculator';
      default:
        return 'Widget';
    }
  };

  const removeWidget = (id: string) => {
    const widget = currentClass.widgets.find(w => w.id === id);
    if (widget?.isCore) return;
    
    setClasses(prevClasses => 
      prevClasses.map(c => 
        c.id === currentClass.id 
          ? { ...c, widgets: c.widgets.filter(w => w.id !== id) }
          : c
      )
    );
    setCurrentClass(prev => ({
      ...prev,
      widgets: prev.widgets.filter(w => w.id !== id)
    }));
  };

  const moveWidget = useCallback((dragIndex: number, hoverIndex: number) => {
    setClasses(prevClasses => 
      prevClasses.map(c => {
        if (c.id === currentClass.id) {
          const newWidgets = [...c.widgets];
          const draggedWidget = newWidgets[dragIndex];
          newWidgets.splice(dragIndex, 1);
          newWidgets.splice(hoverIndex, 0, draggedWidget);
          return { ...c, widgets: newWidgets };
        }
        return c;
      })
    );
    setCurrentClass(prev => {
      const newWidgets = [...prev.widgets];
      const draggedWidget = newWidgets[dragIndex];
      newWidgets.splice(dragIndex, 1);
      newWidgets.splice(hoverIndex, 0, draggedWidget);
      return { ...prev, widgets: newWidgets };
    });
  }, [currentClass.id]);

  const getWidgetComponent = (widget: Widget) => {
    switch (widget.type) {
      case 'timer':
        return <Timer label={widget.label} />;
      case 'notes':
        return <QuickNotes />;
      case 'calculator':
        return <Calculator label={widget.label} />;
      default:
        return null;
    }
  };

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // Check auth status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await getCurrentUser();
        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setIsAuthLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Add useEffect for theme application
  useEffect(() => {
    const theme = getThemeColors(currentClass.theme);
    const root = document.documentElement;
    
    // Apply all theme colors
    root.style.setProperty('--primary-color', theme.primary);
    root.style.setProperty('--secondary-color', theme.secondary);
    root.style.setProperty('--accent-color', theme.accent);
    root.style.setProperty('--background-color', theme.background);
    root.style.setProperty('--surface-color', theme.surface);
    root.style.setProperty('--text-color', theme.text);
    root.style.setProperty('--border-color', theme.border);
    root.style.setProperty('--hover-color', theme.hover);
    
    // Update body background and text color
    document.body.style.backgroundColor = theme.background;
    document.body.style.color = theme.text;
  }, [currentClass.theme]);

  const widgetOptions = [
    { 
      type: 'timer', 
      label: 'Timer', 
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    { 
      type: 'notes', 
      label: 'Quick Notes', 
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      )
    },
    { 
      type: 'calculator', 
      label: 'Calculator', 
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      )
    }
  ];

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-background">
        <header className="header">
          <div className="header-left">
            <div className="header-title">
              <svg viewBox="0 0 24 24">
                <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14z"/>
                <path d="M5 15h14v2H5z"/>
              </svg>
              <span style={{ color: `var(--primary-color)` }}>EduScreen</span>
            </div>
            <div className="theme-selector">
              {themeColors.map((theme) => (
                <button
                  key={theme.name}
                  className={`theme-option ${currentClass.theme === theme.name ? 'active' : ''}`}
                  style={{ 
                    background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
                    boxShadow: currentClass.theme === theme.name ? `0 0 0 2px white, 0 0 0 4px ${theme.primary}` : 'none'
                  }}
                  onClick={() => {
                    setCurrentClass(prev => ({ ...prev, theme: theme.name }));
                  }}
                  title={theme.name}
                />
              ))}
            </div>
            <SupabaseTest />
          </div>
          <div className="header-right">
            {!isAuthenticated ? (
              <button
                onClick={handleSignIn}
                className="btn-primary flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Sign in with Google
              </button>
            ) : (
              <div className="flex items-center gap-4">
                {user?.picture && (
                  <img
                    src={user.picture}
                    alt={user.name}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <button
                  onClick={handleSignOut}
                  className="btn-primary"
                >
                  Sign out
                </button>
              </div>
            )}
      </div>
        </header>

        <main className="main-layout">
          <section className="youtube-section">
            <div className="youtube-container">
              <YouTubePlayerFixed />
              <YouTubeMusicPlayer />
            </div>
          </section>

          <section className="whiteboard-area">
            <TabScreen />
          </section>

          <section className="widget-section">
            <div className="widget-panel-header">
              <button
                onClick={() => setShowWidgetMenu(true)}
                className="add-widget-button"
                title="Add Widget"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
        </button>
            </div>
            
            <div className="widget-grid">
              {currentClass.widgets.map((widget, index) => (
                <DraggableWidget
                  key={widget.id}
                  id={widget.id}
                  index={index}
                  title={widget.label || widget.type}
                  type={widget.type}
                  onRemove={() => removeWidget(widget.id)}
                  classId={currentClass.id}
                  size={widget.size || '1x1'}
                  isCustomizing={true}
                  moveWidget={moveWidget}
                >
                  {getWidgetComponent(widget)}
                </DraggableWidget>
              ))}
            </div>
            
            {showWidgetMenu && (
              <WidgetMenu
                onClose={() => setShowWidgetMenu(false)}
                onSelectWidget={handleAddWidget}
              />
            )}
          </section>
        </main>
      </div>
    </DndProvider>
  );
}

