import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

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
  index: number;
  moveWidget: (dragIndex: number, hoverIndex: number) => void;
  type: 'timer' | 'notes' | 'calculator' | 'youtube';
}

const ItemTypes = {
  WIDGET: 'widget'
};

export const DraggableWidget: React.FC<DraggableWidgetProps> = ({
  children,
  id,
  title,
  icon,
  onRemove,
  canRemove = true,
  classId,
  size = '1x1',
  isCustomizing = false,
  index,
  moveWidget,
  type
}) => {
  const [isMinimized, setIsMinimized] = React.useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.WIDGET,
    item: () => ({ id, index, size, type }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: () => isCustomizing,
  });

  const [, drop] = useDrop({
    accept: ItemTypes.WIDGET,
    hover: (item: { id: string; index: number; size: string; type: string }, monitor) => {
      if (!ref.current) return;
      
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      moveWidget(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
    canDrop: () => isCustomizing,
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`
        widget
        ${type}-widget
        transition-all duration-200
        ${isMinimized ? 'minimized' : ''}
        ${isDragging ? 'dragging' : ''}
      `}
      data-size={size}
      style={{
        opacity: isDragging ? 0.4 : 1,
      }}
    >
      <div className={`widget-header ${type === 'notes' ? 'notes-header' : ''}`}>
        <div className="flex items-center space-x-3">
          {isCustomizing && (
            <div className="drag-handle w-8 h-8 rounded-full flex items-center justify-center cursor-move">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M5 10h14M5 14h14" />
              </svg>
            </div>
          )}
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            {icon || (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
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

      <div 
        className={`
          widget-content
          ${isMinimized ? 'max-h-0' : 'h-[calc(100%-3rem)]'}
        `}
      >
        {children}
      </div>
    </div>
  );
}; 