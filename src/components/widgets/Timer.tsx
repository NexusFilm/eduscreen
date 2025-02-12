import { useState, useEffect, useRef } from 'react';

interface TimerProps {
  label?: string;
}

type AlarmType = 'gentle' | 'standard' | 'urgent';

const ALARM_SOUNDS = {
  gentle: {
    src: '/sounds/alarm.mp3',
    volume: 0.6
  },
  standard: {
    src: '/sounds/alarm.mp3',
    volume: 0.8
  },
  urgent: {
    src: '/sounds/alarm.mp3',
    volume: 1.0
  }
};

export const Timer: React.FC<TimerProps> = ({ label = 'Timer' }) => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectedAlarm, setSelectedAlarm] = useState<AlarmType>('standard');
  const [isEditingLabel, setIsEditingLabel] = useState(false);
  const [currentLabel, setCurrentLabel] = useState(label);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [initialTime, setInitialTime] = useState(0);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;
    if (isRunning && time > 0) {
      intervalId = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 1) {
            playAlarm();
            setIsRunning(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isRunning]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    if (audioRef.current) {
      // Set initial volume based on selected alarm type
      audioRef.current.volume = ALARM_SOUNDS[selectedAlarm].volume;
      audioRef.current.loop = true;
    }
  }, [selectedAlarm]);

  const playAlarm = () => {
    if (audioRef.current) {
      audioRef.current.volume = ALARM_SOUNDS[selectedAlarm].volume;
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(error => {
        console.error('Error playing alarm:', error);
        const playPromise = audioRef.current?.play();
        if (playPromise) {
          playPromise.catch(() => {
            setError('Please click anywhere on the page to enable sound.');
          });
        }
      });
    }
  };

  const stopAlarm = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleStartStop = () => {
    if (time === 0 && !isRunning) {
      setIsEditing(true);
      return;
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setTime(0);
    setIsRunning(false);
    setInputValue('');
    stopAlarm();
  };

  const handleTimeClick = () => {
    if (!isRunning) {
      setIsEditing(true);
    }
  };

  const handleInputChange = (value: string) => {
    // Only allow numbers and colon
    const cleanValue = value.replace(/[^0-9:]/g, '');
    
    // Format input as MM:SS
    if (cleanValue.length > 0) {
      const numbers = cleanValue.replace(':', '');
      if (numbers.length <= 2) {
        setInputValue(numbers);
      } else if (numbers.length <= 4) {
        const minutes = numbers.slice(0, -2);
        const seconds = numbers.slice(-2);
        setInputValue(`${minutes}:${seconds}`);
      }
    } else {
      setInputValue('');
    }
  };

  const handleTimeSubmit = () => {
    if (!inputValue) return;

    let totalSeconds = 0;
    const numbers = inputValue.replace(':', '');
    
    if (numbers.length <= 2) {
      totalSeconds = parseInt(numbers);
    } else {
      const minutes = parseInt(numbers.slice(0, -2)) || 0;
      const seconds = parseInt(numbers.slice(-2)) || 0;
      totalSeconds = (minutes * 60) + seconds;
    }

    totalSeconds = Math.min(totalSeconds, 3600);
    setTime(totalSeconds);
    setInitialTime(totalSeconds);
    setInputValue('');
    setIsEditing(false);
    setIsRunning(true);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTimeSubmit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setInputValue('');
    } else if (e.key === ':' && inputValue.includes(':')) {
      // Prevent multiple colons
      e.preventDefault();
    }
  };

  const calculateProgress = (timeInSeconds: number) => {
    const totalSeconds = time;
    if (totalSeconds === 0) return 0;
    const progress = (timeInSeconds / totalSeconds) * 100;
    return progress;
  };

  const getCircleStyle = (progress: number) => {
    const circumference = 2 * Math.PI * 120; // radius = 120
    const offset = circumference - (progress / 100) * circumference;
    return {
      strokeDasharray: `${circumference} ${circumference}`,
      strokeDashoffset: offset,
    };
  };

  return (
    <div className="p-4 relative text-white rounded-lg h-full flex flex-col"
      style={{
        background: `linear-gradient(135deg, var(--primary-color), var(--secondary-color))`,
      }}
    >
      {/* Timer Label */}
      <div className="text-center mb-2">
        {isEditingLabel ? (
          <input
            type="text"
            value={currentLabel}
            onChange={(e) => setCurrentLabel(e.target.value)}
            onBlur={() => setIsEditingLabel(false)}
            onKeyDown={(e) => e.key === 'Enter' && setIsEditingLabel(false)}
            className="text-lg font-medium text-center bg-transparent border-b border-white/30 text-white focus:outline-none"
            autoFocus
          />
        ) : (
          <h3
            onClick={() => setIsEditingLabel(true)}
            className="text-lg font-medium cursor-pointer hover:text-white/80"
          >
            {currentLabel}
          </h3>
        )}
      </div>

      {/* Compact Timer Display */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="relative w-32 h-32 mb-4">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="rgba(255, 255, 255, 0.2)"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="white"
              strokeWidth="8"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - time / (initialTime || 1))}`}
              className="transition-all duration-150"
            />
          </svg>
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={handleInputKeyDown}
              className="absolute inset-0 w-full h-full flex items-center justify-center
                text-2xl font-mono text-center bg-transparent text-white border-none focus:outline-none"
              placeholder="00:00"
              maxLength={5}
              autoFocus
            />
          ) : (
            <div
              onClick={handleTimeClick}
              className="absolute inset-0 flex items-center justify-center
                text-3xl font-mono cursor-pointer hover:text-white/80"
            >
              {formatTime(time)}
            </div>
          )}
        </div>

        {/* Compact Controls */}
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={handleStartStop}
            className="px-4 py-2 rounded-full bg-white/20 hover:bg-white/30
              text-white text-sm font-medium transition-all duration-200"
          >
            {isRunning ? 'Stop' : (time === 0 ? 'Set Time' : 'Start')}
          </button>
          {time > 0 && (
            <button
              onClick={handleReset}
              className="px-4 py-2 rounded-full bg-white/20 hover:bg-white/30
                text-white text-sm font-medium transition-all duration-200"
            >
              Reset
            </button>
          )}
        </div>

        {/* Alarm Type Selector */}
        <div className="flex items-center justify-center gap-2">
          {(['gentle', 'standard', 'urgent'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setSelectedAlarm(type)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200
                ${selectedAlarm === type ? 'bg-white/30 ring-2 ring-white/50' : 'bg-white/20'}
                text-white capitalize`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <audio ref={audioRef} src={ALARM_SOUNDS[selectedAlarm].src} />
    </div>
  );
}; 