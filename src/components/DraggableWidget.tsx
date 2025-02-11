import React, { useState, useRef, useEffect } from 'react';

interface Position {
  x: number;
  y: number;
}

interface DraggableWidgetProps {
  children: React.ReactNode;
  id: string;
  title: string;
  icon?: React.ReactNode;
  onPositionChange?: (id: string, position: Position) => void;
  initialPosition?: Position;
  onRemove?: () => void;
  canRemove?: boolean;
  classId: string;
  size?: '1x1' | '1x2' | '2x1' | '2x2';
  isCustomizing?: boolean;
}

export const DraggableWidget: React.FC<DraggableWidgetProps> = ({
  children,
  id,
  title,
  icon,
  onPositionChange,
  initialPosition,
  onRemove,
  canRemove = true,
  classId,
  size = '1x1',
  isCustomizing = false,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState<Position>(initialPosition || { x: 0, y: 0 });
  const dragRef = useRef<HTMLDivElement>(null);
  const mouseOffset = useRef<Position>({ x: 0, y: 0 });

  useEffect(() => {
    if (dragRef.current && !isDragging) {
      dragRef.current.style.transform = `translate(${position.x}px, ${position.y}px)`;
    }
  }, [position, isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isCustomizing) return;

    e.preventDefault();
    const rect = dragRef.current?.getBoundingClientRect();
    if (!rect) return;

    setIsDragging(true);
    mouseOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !dragRef.current) return;

    const gridRect = dragRef.current.parentElement?.getBoundingClientRect();
    if (!gridRect) return;

    const widgetRect = dragRef.current.getBoundingClientRect();
    
    // Calculate new position
    let x = e.clientX - mouseOffset.current.x - gridRect.left;
    let y = e.clientY - mouseOffset.current.y - gridRect.top;

    // Constrain to grid boundaries
    x = Math.max(0, Math.min(x, gridRect.width - widgetRect.width));
    y = Math.max(0, Math.min(y, gridRect.height - widgetRect.height));

    dragRef.current.style.transform = `translate(${x}px, ${y}px)`;
  };

  const handleMouseUp = (e: MouseEvent) => {
    if (!isDragging || !dragRef.current) return;

    const gridRect = dragRef.current.parentElement?.getBoundingClientRect();
    if (!gridRect) return;

    const widgetRect = dragRef.current.getBoundingClientRect();
    
    // Calculate final position
    let x = e.clientX - mouseOffset.current.x - gridRect.left;
    let y = e.clientY - mouseOffset.current.y - gridRect.top;

    // Constrain to grid boundaries
    x = Math.max(0, Math.min(x, gridRect.width - widgetRect.width));
    y = Math.max(0, Math.min(y, gridRect.height - widgetRect.height));

    setPosition({ x, y });
    setIsDragging(false);
    
    if (onPositionChange) {
      onPositionChange(id, { x, y });
    }

    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const defaultIcon = (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
        d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );

  return (
    <div
      ref={dragRef}
      data-widget-id={id}
      className={`
        widget
        transition-all duration-200
        ${isMinimized ? 'minimized' : ''}
        ${isDragging ? 'dragging' : ''}
      `}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
    >
      {/* Header */}
      <div
        className={`
          flex items-center justify-between px-4 py-3
          select-none text-white
          bg-gradient-to-r from-primary-color to-secondary-color
        `}
      >
        <div className="flex items-center space-x-3">
          {isCustomizing && (
            <div
              className="drag-handle w-8 h-8 rounded-full flex items-center justify-center"
              onMouseDown={handleMouseDown}
              title="Drag to move widget"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M5 10h14M5 14h14" />
              </svg>
            </div>
          )}
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            {icon || defaultIcon}
          </div>
          <span className="font-medium truncate">{title}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center
              hover:bg-white/20 transition-colors duration-150"
          >
            <svg
              className={`w-5 h-5 transition-transform duration-200 ${isMinimized ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M5 15l7-7 7 7" 
              />
            </svg>
          </button>

          {canRemove && onRemove && isCustomizing && (
            <button
              onClick={onRemove}
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center
                hover:bg-red-500 transition-colors duration-150"
              title="Remove widget"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div 
        className={`
          widget-content overflow-hidden transition-all duration-300 ease-in-out bg-white
          ${isMinimized ? 'max-h-0' : 'h-[calc(100%-3rem)]'}
        `}
      >
        {children}
      </div>
    </div>
  );
}; 