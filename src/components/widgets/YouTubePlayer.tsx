import React, { useState } from 'react';

interface Video {
  id: string;
  title: string;
}

interface YouTubePlayerProps {
  onVideoSave: (video: Video) => void;
  onVideoRemove: (videoId: string) => void;
  savedVideos: Video[];
}

export const YouTubePlayer: React.FC<YouTubePlayerProps> = ({
  onVideoSave,
  onVideoRemove,
  savedVideos
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Video[]>([]);

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=8&q=${encodeURIComponent(searchQuery)}&type=video&key=${import.meta.env.VITE_YOUTUBE_API_KEY}`
      );
      const data = await response.json();
      
      const videos = data.items.map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title
      }));
      
      setSearchResults(videos);
    } catch (error) {
      console.error('Error searching videos:', error);
    }
  };

  return (
    <div className="h-full flex">
      {/* Main Content - Search and Results */}
      <div className="flex-1 flex flex-col">
        {/* Search Bar */}
        <div className="flex gap-2 p-4 border-b">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search YouTube videos..."
            className="flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary-color"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-primary-color text-white rounded-lg hover:bg-opacity-90"
          >
            Search
          </button>
        </div>

        {/* Search Results */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 gap-4">
            {searchResults.map((video) => (
              <div
                key={video.id}
                className="p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <iframe
                  width="100%"
                  height="200"
                  src={`https://www.youtube.com/embed/${video.id}`}
                  title={video.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
                <h3 className="mt-2 font-medium line-clamp-2">{video.title}</h3>
                <button
                  onClick={() => onVideoSave(video)}
                  className="mt-2 px-3 py-1 text-sm bg-primary-color text-white rounded-lg hover:bg-opacity-90"
                >
                  Save
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Saved Videos Sidebar */}
      <div className="w-64 border-l flex flex-col">
        <div className="p-4 border-b">
          <h3 className="font-medium">Saved Videos ({savedVideos.length})</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {savedVideos.map((video) => (
              <div key={video.id} className="border rounded-lg p-3">
                <iframe
                  width="100%"
                  height="120"
                  src={`https://www.youtube.com/embed/${video.id}`}
                  title={video.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
                <h4 className="mt-2 text-sm font-medium line-clamp-2">{video.title}</h4>
                <button
                  onClick={() => onVideoRemove(video.id)}
                  className="mt-2 px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}; 