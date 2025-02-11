import { useState, useEffect, useRef } from 'react';

interface TimerProps {
  label?: string;
}

type AlarmType = 'gentle' | 'standard' | 'urgent';

const ALARM_SOUNDS = {
  gentle: '/sounds/gentle-chime.mp3',
  standard: '/sounds/standard-bell.mp3',
  urgent: '/sounds/urgent-alarm.mp3',
};

export const Timer: React.FC<TimerProps> = ({ label = 'Timer' }) => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectedAlarm, setSelectedAlarm] = useState<AlarmType>('standard');
  const [isEditingLabel, setIsEditingLabel] = useState(false);
  const [currentLabel, setCurrentLabel] = useState(label);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

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
      // Set volume to -10dB (approximately 0.32 in the 0-1 range)
      audioRef.current.volume = 0.32;
    }
  }, []);

  const playAlarm = () => {
    if (audioRef.current) {
      audioRef.current.volume = 0.32; // Ensure volume is set before playing
      audioRef.current.play().catch(error => console.error('Error playing alarm:', error));
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
  };

  const handleTimeClick = () => {
    if (!isRunning) {
      setIsEditing(true);
    }
  };

  const handleInputChange = (value: string) => {
    // Only allow numbers and colon
    const cleanValue = value.replace(/[^0-9:]/g, '');
    setInputValue(cleanValue);
  };

  const handleTimeSubmit = () => {
    if (!inputValue) return;

    let totalSeconds = 0;
    if (inputValue.includes(':')) {
      const [minutes, seconds] = inputValue.split(':').map(v => parseInt(v) || 0);
      if (inputValue.startsWith(':')) {
        // If input starts with ':', treat the number as seconds
        totalSeconds = parseInt(inputValue.slice(1)) || 0;
      } else {
        // Input has minutes and seconds
        totalSeconds = (minutes * 60) + seconds;
      }
    } else {
      // If no colon, always treat as seconds
      totalSeconds = parseInt(inputValue);
    }

    // Limit to maximum of 60 minutes (3600 seconds)
    totalSeconds = Math.min(totalSeconds, 3600);
    
    setTime(totalSeconds);
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
    <div className="p-6 relative text-white rounded-b-2xl h-full"
      style={{
        background: `linear-gradient(135deg, var(--primary-color), var(--secondary-color))`,
      }}
    >
      <div className="flex flex-col items-center">
        {/* Label */}
        <div className="w-full text-center mb-4">
          {isEditingLabel ? (
            <input
              type="text"
              value={currentLabel}
              onChange={(e) => setCurrentLabel(e.target.value)}
              onBlur={() => setIsEditingLabel(false)}
              onKeyDown={(e) => e.key === 'Enter' && setIsEditingLabel(false)}
              className="text-lg font-medium text-center border-b-2 border-white/30 bg-transparent text-white focus:outline-none"
              autoFocus
            />
          ) : (
            <h3
              onClick={() => setIsEditingLabel(true)}
              className="text-lg font-medium text-white cursor-pointer hover:text-white/80 transition-colors duration-200"
            >
              {currentLabel}
            </h3>
          )}
        </div>

        {/* Circular Timer */}
        <div className="relative w-64 h-64 mb-6">
          {/* Background Circle */}
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 256 256">
            <circle
              cx="128"
              cy="128"
              r="120"
              fill="none"
              stroke="rgba(255, 255, 255, 0.2)"
              strokeWidth="8"
            />
            {/* Progress Circle */}
            <circle
              cx="128"
              cy="128"
              r="120"
              fill="none"
              stroke="white"
              strokeWidth="8"
              strokeLinecap="round"
              {...getCircleStyle(calculateProgress(time))}
              className="transition-all duration-150"
            />
          </svg>
          
          {/* Timer Display */}
          {isEditing ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={handleInputKeyDown}
                className="w-32 px-3 py-2 text-4xl font-mono text-center bg-transparent text-white border-b-2 border-white/30 focus:outline-none"
                placeholder="0"
                maxLength={4}
                autoFocus
              />
            </div>
          ) : (
            <div
              onClick={handleTimeClick}
              className={`absolute inset-0 flex items-center justify-center text-6xl font-bold font-mono tracking-wider text-white
                ${!isRunning ? 'cursor-pointer hover:text-white/80' : ''}
              `}
            >
              {time === 0 ? "00:00" : formatTime(time)}
            </div>
          )}
        </div>

        <div className="flex flex-col items-center space-y-4 w-full">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleStartStop}
              className={`
                px-8 py-3 rounded-lg text-sm font-medium transition-all duration-300
                transform hover:scale-105 active:scale-95
                focus:outline-none focus:ring-2 focus:ring-white/50
                bg-white/20 backdrop-blur-sm
                text-white hover:bg-white/30
                shadow-lg hover:shadow-xl
              `}
            >
              <div className="flex items-center space-x-2">
                {isRunning ? (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Stop</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{time === 0 ? 'Set Time' : 'Start'}</span>
                  </>
                )}
              </div>
            </button>
            
            {time > 0 && (
              <button
                onClick={handleReset}
                className="px-8 py-3 rounded-lg text-sm font-medium
                  bg-white/20 backdrop-blur-sm text-white 
                  hover:bg-white/30 transition-all duration-300
                  transform hover:scale-105 active:scale-95
                  shadow-lg hover:shadow-xl
                  focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Reset</span>
                </div>
              </button>
            )}
          </div>

          <div className="flex items-center justify-center space-x-4 mt-4">
            <button
              onClick={() => setSelectedAlarm('gentle')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
                transform hover:scale-105 active:scale-95
                ${selectedAlarm === 'gentle' 
                  ? 'bg-white/30 ring-2 ring-white/50' 
                  : 'bg-white/20 hover:bg-white/30'}
                text-white backdrop-blur-sm shadow-lg hover:shadow-xl`}
            >
              Gentle
            </button>
            <button
              onClick={() => setSelectedAlarm('standard')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
                transform hover:scale-105 active:scale-95
                ${selectedAlarm === 'standard'
                  ? 'bg-white/30 ring-2 ring-white/50'
                  : 'bg-white/20 hover:bg-white/30'}
                text-white backdrop-blur-sm shadow-lg hover:shadow-xl`}
            >
              Standard
            </button>
            <button
              onClick={() => setSelectedAlarm('urgent')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
                transform hover:scale-105 active:scale-95
                ${selectedAlarm === 'urgent'
                  ? 'bg-white/30 ring-2 ring-white/50'
                  : 'bg-white/20 hover:bg-white/30'}
                text-white backdrop-blur-sm shadow-lg hover:shadow-xl`}
            >
              Urgent
            </button>
          </div>
        </div>
      </div>

      <audio ref={audioRef} src={ALARM_SOUNDS[selectedAlarm]} />
    </div>
  );
}; 