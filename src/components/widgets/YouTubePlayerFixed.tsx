import React from 'react';
import { YouTubePlayer } from './YouTubePlayer';

interface Video {
  id: string;
  title: string;
}

export const YouTubePlayerFixed: React.FC = () => {
  const [savedVideos, setSavedVideos] = React.useState<Video[]>([]);

  return (
    <div className="h-full">
      <YouTubePlayer
        onVideoSave={(video) => setSavedVideos(prev => [...prev, video])}
        savedVideos={savedVideos}
        onVideoRemove={(videoId) => setSavedVideos(prev => prev.filter(v => v.id !== videoId))}
      />
    </div>
  );
}; 