import React, { useState, useRef } from 'react';
// Import apiClient but don't use it until Vercel backend is ready
import apiClient from '../../lib/api-client';

interface Track {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  duration: number;
}

interface SearchMusicResponse {
  tracks: Track[];
}

// Mock data to use while API is not ready
const MOCK_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Study Focus',
    artist: 'Ambient Soundscapes',
    thumbnail: 'https://i.imgur.com/JwYmJYI.jpeg',
    duration: 180
  },
  {
    id: '2',
    title: 'Deep Concentration',
    artist: 'Lo-Fi Beats',
    thumbnail: 'https://i.imgur.com/dT6yJ8V.jpeg',
    duration: 180
  },
  {
    id: '3',
    title: 'Peaceful Piano',
    artist: 'Classical Essentials',
    thumbnail: 'https://i.imgur.com/K3KSGWk.jpeg',
    duration: 180
  },
  {
    id: '4',
    title: 'Morning Focus',
    artist: 'Instrumental Study',
    thumbnail: 'https://i.imgur.com/YfJqX3V.jpeg',
    duration: 180
  }
];

interface YouTubeMusicPlayerProps {
  onTrackSelect?: (track: Track) => void;
}

export const YouTubeMusicPlayer: React.FC<YouTubeMusicPlayerProps> = ({ onTrackSelect }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [playlist, setPlaylist] = useState<Track[]>(MOCK_TRACKS);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showRadio, setShowRadio] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);

  const searchMusic = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.searchMusic(searchQuery) as SearchMusicResponse;
      setPlaylist(response.tracks);
    } catch (err) {
      setError('Failed to search music. Please try again.');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTrackSelect = (track: Track) => {
    setCurrentTrack(track);
    setCurrentTime(0);
    setIsPlaying(true);
    if (onTrackSelect) {
      onTrackSelect(track);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !currentTrack) return;
    const rect = progressRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    setCurrentTime(Math.floor(percentage * currentTrack.duration));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNext = () => {
    if (!currentTrack || playlist.length === 0) return;
    const currentIndex = playlist.findIndex(track => track.id === currentTrack.id);
    const nextTrack = playlist[(currentIndex + 1) % playlist.length];
    handleTrackSelect(nextTrack);
  };

  const handlePrevious = () => {
    if (!currentTrack || playlist.length === 0) return;
    const currentIndex = playlist.findIndex(track => track.id === currentTrack.id);
    const prevTrack = playlist[(currentIndex - 1 + playlist.length) % playlist.length];
    handleTrackSelect(prevTrack);
  };

  const startRadio = async () => {
    if (!currentTrack) return;
    setIsLoading(true);
    try {
      const radioTracks = await apiClient.getRadioTracks(currentTrack.id) as Track[];
      setPlaylist(radioTracks);
      setShowRadio(true);
    } catch (err) {
      setError('Failed to start radio. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="youtube-music-player">
      {/* YouTube Music Header */}
      <div className="flex flex-col p-6 border-b border-white/10">
        <div className="flex items-center mb-4">
          <svg className="w-24 h-8" viewBox="0 0 80 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 12C10 7.6 13.6 4 18 4C22.4 4 26 7.6 26 12C26 16.4 22.4 20 18 20C13.6 20 10 16.4 10 12ZM38 4H34V20H38V4ZM44 4H40V20H44V4ZM51 7.2C53.2 7.2 55 9 55 11.2V20H51V12.4C51 11.6 50.4 11 49.6 11C48.8 11 48.2 11.6 48.2 12.4V20H44.2V7.6H48.2V8.8C49 7.8 50 7.2 51 7.2ZM72 4H68V8.8C67.2 7.8 66 7.2 64.6 7.2C61.6 7.2 59.2 9.6 59.2 12.6C59.2 15.6 61.6 18 64.6 18C66 18 67.2 17.4 68 16.4V17.6H72V4ZM65.8 14.8C64.4 14.8 63.2 13.8 63.2 12.4C63.2 11 64.4 10 65.8 10C67.2 10 68.4 11 68.4 12.4C68.4 13.8 67.2 14.8 65.8 14.8Z" fill="currentColor"/>
            <path d="M18 0C8 0 0 8 0 18C0 28 8 36 18 36C28 36 36 28 36 18C36 8 28 0 18 0ZM26.6 20.2C26 20.8 24.8 20.8 24.2 20.2L18.8 14.8V24.8C18.8 25.8 17.8 26.2 16.8 26.2C15.8 26.2 14.8 25.8 14.8 24.8V14.8L9.4 20.2C8.8 20.8 7.6 20.8 7 20.2C6.4 19.6 6.4 18.4 7 17.8L16.2 8.6C16.8 8 18 8 18.6 8L27.8 17.2C28.4 17.8 28.4 19 27.8 19.6L26.6 20.2Z" fill="var(--primary-color)"/>
          </svg>
          <span className="text-xl font-medium ml-2 text-white">Music</span>
        </div>

        {/* Search Bar with Button */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && searchMusic()}
              placeholder="Search for music..."
              className="w-full py-3 pl-10 pr-4 bg-white/5 border border-white/10 rounded-full text-white placeholder-white/60 focus:outline-none focus:border-white/20"
            />
            <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button
            onClick={searchMusic}
            className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
          >
            Search
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="mt-2 text-white/60 text-sm flex items-center gap-2">
          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Searching...
        </div>
      )}

      {error && (
        <div className="mx-4 p-3 bg-red-500/10 text-red-400 rounded-lg text-sm">
          {error}
        </div>
      )}

      {currentTrack && (
        <div className="now-playing">
          <div className="relative w-12 h-12 rounded-lg overflow-hidden">
            <img src={currentTrack.thumbnail} alt="Album art" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="track-info">
              <h3 className="font-medium text-white truncate">{currentTrack.title}</h3>
              <p className="text-sm text-white/70 truncate">{currentTrack.artist}</p>
            </div>
            {/* Progress Bar */}
            <div 
              ref={progressRef}
              className="mt-2 h-1 bg-white/10 rounded cursor-pointer"
              onClick={handleProgressClick}
            >
              <div 
                className="h-full bg-white rounded"
                style={{ width: `${(currentTime / currentTrack.duration) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-white/60 mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(currentTrack.duration)}</span>
            </div>
          </div>
          {/* Playback Controls */}
          <div className="flex items-center gap-2">
            <button onClick={handlePrevious} className="p-2 hover:bg-white/10 rounded-full">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-full"
            >
              {isPlaying ? (
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </button>
            <button onClick={handleNext} className="p-2 hover:bg-white/10 rounded-full">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button 
              onClick={startRadio}
              className="ml-2 px-4 py-2 text-sm text-white bg-white/10 hover:bg-white/20 rounded-full"
            >
              Start Radio
            </button>
          </div>
        </div>
      )}

      <div className="playlist">
        {playlist.map((track) => (
          <div
            key={track.id}
            className={`playlist-item ${currentTrack?.id === track.id ? 'active' : ''}`}
            onClick={() => handleTrackSelect(track)}
          >
            <div className="relative w-10 h-10 rounded overflow-hidden flex-shrink-0">
              <img src={track.thumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
              {currentTrack?.id === track.id && isPlaying && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
            <div className="track-info flex-1 min-w-0">
              <h4 className="font-medium text-white truncate">{track.title}</h4>
              <p className="text-sm text-white/70 truncate">{track.artist}</p>
            </div>
            <span className="text-sm text-white/60">{formatTime(track.duration)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}; 