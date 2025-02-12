import React, { useState, useEffect } from 'react';

interface TimerProps {
  id: string;
  onRemove: () => void;
  className: string;
}

const Timer: React.FC<TimerProps> = ({ id, onRemove, className }) => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={className}>
      <div className="widget-header">
        <h3>Timer</h3>
        <button onClick={onRemove} className="remove-widget">×</button>
      </div>
      <div className="widget-content timer-content">
        <div className="timer-display">{formatTime(time)}</div>
        <div className="timer-controls">
          <button onClick={() => setIsRunning(!isRunning)}>
            {isRunning ? 'Stop' : 'Start'}
          </button>
          <button onClick={() => setTime(0)}>Reset</button>
        </div>
      </div>
    </div>
  );
};

export default Timer; 