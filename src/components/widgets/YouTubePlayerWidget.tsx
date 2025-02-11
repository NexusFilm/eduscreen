import React, { useState } from 'react';
import { YouTubePlayer } from './YouTubePlayer';

interface YouTubePlayerWidgetProps {
  label?: string;
}

export const YouTubePlayerWidget: React.FC<YouTubePlayerWidgetProps> = ({ label = 'YouTube Player' }) => {
  const [savedVideos, setSavedVideos] = useState<Array<{ id: string; title: string }>>([]);

  return (
    <div className="h-full flex flex-col">
      <YouTubePlayer
        onVideoSave={(video) => setSavedVideos(prev => [...prev, video])}
        savedVideos={savedVideos}
        onVideoRemove={(videoId) => setSavedVideos(prev => prev.filter(v => v.id !== videoId))}
      />
    </div>
  );
}; 