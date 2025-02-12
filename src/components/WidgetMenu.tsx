import React from 'react';

interface WidgetMenuProps {
  onClose: () => void;
  onSelectWidget: (type: string) => void;
}

const widgetOptions = [
  {
    type: 'timer',
    label: 'Timer',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    type: 'notes',
    label: 'Quick Notes',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
  },
  {
    type: 'calculator',
    label: 'Calculator',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
];

export const WidgetMenu: React.FC<WidgetMenuProps> = ({ onClose, onSelectWidget }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div 
        className="bg-white rounded-xl shadow-xl p-6 w-96 transform transition-all"
        onClick={e => e.stopPropagation()}
      >
        <h3 className="text-lg font-medium mb-4">Add Widget</h3>
        <div className="grid grid-cols-2 gap-4">
          {widgetOptions.map(option => (
            <button
              key={option.type}
              className="flex flex-col items-center justify-center p-4 rounded-lg
                border border-gray-200 hover:border-primary-500 hover:bg-primary-50
                transition-all duration-200"
              onClick={() => {
                onSelectWidget(option.type);
                onClose();
              }}
            >
              <div className="text-primary-600 mb-2">
                {option.icon}
              </div>
              <span className="text-sm font-medium">{option.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WidgetMenu; 