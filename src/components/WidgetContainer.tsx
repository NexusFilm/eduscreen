import React from 'react';
import Timer from './Timer';
import Notes from './Notes';
import Calculator from './Calculator';
import { Widget } from '../types';

interface WidgetContainerProps {
  widgets: Widget[];
  onRemoveWidget: (id: string) => void;
}

const WidgetContainer: React.FC<WidgetContainerProps> = ({ widgets, onRemoveWidget }) => {
  const renderWidget = (widget: Widget) => {
    const commonProps = {
      key: widget.id,
      id: widget.id,
      onRemove: () => onRemoveWidget(widget.id),
      className: `widget ${widget.type}-widget`
    };

    switch (widget.type) {
      case 'timer':
        return <Timer {...commonProps} />;
      case 'notes':
        return <Notes {...commonProps} />;
      case 'calculator':
        return <Calculator {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <div className="widget-grid">
      {widgets.map(renderWidget)}
    </div>
  );
};

export default WidgetContainer; 