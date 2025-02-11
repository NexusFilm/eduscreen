import { useState, useEffect } from 'react';

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
  widgetHeader: string;
  widgetBackground: string;
}

interface ColorThemeProps {
  currentClass: {
    id: string;
    name: string;
    theme: string;
  };
  onThemeChange: (theme: string) => void;
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
    hover: '#F1F5F9',
    widgetHeader: '#4F46E5',
    widgetBackground: '#FFFFFF'
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
    hover: '#FFF3E7',
    widgetHeader: '#F97316',
    widgetBackground: '#FFFFFF'
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
    hover: '#ECFDF5',
    widgetHeader: '#059669',
    widgetBackground: '#FFFFFF'
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
    hover: '#FDF2F8',
    widgetHeader: '#DB2777',
    widgetBackground: '#FFFFFF'
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
    hover: '#1E293B',
    widgetHeader: '#6366F1',
    widgetBackground: '#1E293B'
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
    hover: '#F1F5F9',
    widgetHeader: '#475569',
    widgetBackground: '#F8FAFC'
  }
];

export const ColorTheme: React.FC<ColorThemeProps> = ({ currentClass, onThemeChange }) => {
  const [selectedTheme, setSelectedTheme] = useState<ThemeColor>(
    themeColors.find(t => t.name === currentClass.theme) || themeColors[0]
  );

  const applyTheme = (theme: ThemeColor) => {
    // Store theme in localStorage for this specific class
    const classThemes = JSON.parse(localStorage.getItem('class-themes') || '{}');
    classThemes[currentClass.id] = theme.name;
    localStorage.setItem('class-themes', JSON.stringify(classThemes));

    // Apply theme to CSS variables globally
    const root = document.documentElement;
    root.style.setProperty('--primary-color', theme.primary);
    root.style.setProperty('--secondary-color', theme.secondary);
    root.style.setProperty('--accent-color', theme.accent);
    root.style.setProperty('--background-color', theme.background);
    root.style.setProperty('--surface-color', theme.surface);
    root.style.setProperty('--text-color', theme.text);
    root.style.setProperty('--border-color', theme.border);
    root.style.setProperty('--hover-color', theme.hover);
    root.style.setProperty('--widget-header', theme.widgetHeader);
    root.style.setProperty('--widget-background', theme.widgetBackground);
  };

  const handleThemeChange = (theme: ThemeColor) => {
    setSelectedTheme(theme);
    applyTheme(theme);
    onThemeChange(theme.name);
  };

  // Apply theme on component mount and when currentClass changes
  useEffect(() => {
    const theme = themeColors.find(t => t.name === currentClass.theme) || themeColors[0];
    setSelectedTheme(theme);
    applyTheme(theme);
  }, [currentClass.id, currentClass.theme]);

  return (
    <div className="w-full py-4 px-6">
      <div className="flex items-center justify-center space-x-4">
        {themeColors.map((theme) => (
          <button
            key={theme.name}
            onClick={() => handleThemeChange(theme)}
            className={`relative group`}
            title={theme.name}
          >
            <div 
              className={`w-12 h-12 rounded-full transition-all duration-300 transform
                ${selectedTheme.name === theme.name 
                  ? 'ring-4 ring-offset-2 ring-gray-400 scale-110' 
                  : 'hover:scale-110 hover:ring-2 hover:ring-offset-2 hover:ring-gray-300'}
                shadow-md hover:shadow-lg`}
              style={{
                background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`
              }}
            />
            {selectedTheme.name === theme.name && (
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-600 capitalize whitespace-nowrap">
                {theme.name}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}; 