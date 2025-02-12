import React, { useState } from 'react';

interface Video {
  id: string;
  title: string;
  thumbnail?: string;
  duration?: string;
}

interface YouTubeSearchResult {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    thumbnails: {
      medium: {
        url: string;
      };
    };
  };
}

export const YouTubePlayerFixed: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Video[]>([]);
  const [savedVideos, setSavedVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${encodeURIComponent(
          searchQuery
        )}&type=video&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch videos');
      }

      const data = await response.json();
      
      const videos: Video[] = data.items.map((item: YouTubeSearchResult) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.medium.url
      }));

      setSearchResults(videos);
    } catch (err) {
      setError('Failed to search videos. Please try again.');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="youtube-player h-full flex">
      {/* Main Content - Search and Results */}
      <div className="flex-1 flex flex-col">
        {/* YouTube Header */}
        <div className="flex items-center p-6 border-b border-border-color">
          <div className="flex items-center">
            <svg className="w-8 h-8" viewBox="0 0 90 20" preserveAspectRatio="xMidYMid meet" style={{ color: 'var(--primary-color)' }}>
              <g>
                <path d="M27.9727 3.12324C27.6435 1.89323 26.6768 0.926623 25.4468 0.597366C23.2197 2.24288e-07 14.285 0 14.285 0C14.285 0 5.35042 2.24288e-07 3.12323 0.597366C1.89323 0.926623 0.926623 1.89323 0.597366 3.12324C2.24288e-07 5.35042 0 10 0 10C0 10 2.24288e-07 14.6496 0.597366 16.8768C0.926623 18.1068 1.89323 19.0734 3.12323 19.4026C5.35042 20 14.285 20 14.285 20C14.285 20 23.2197 20 25.4468 19.4026C26.6768 19.0734 27.6435 18.1068 27.9727 16.8768C28.5701 14.6496 28.5701 10 28.5701 10C28.5701 10 28.5677 5.35042 27.9727 3.12324Z" fill="currentColor" />
                <path d="M11.4253 14.2854L18.8477 10.0004L11.4253 5.71533V14.2854Z" fill="white" />
              </g>
            </svg>
            <span className="ml-3 text-lg font-medium">Video Player</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-border-color">
          <div className="flex gap-2">
            <div className="flex-1 flex items-center px-4 bg-surface-color border border-border-color rounded-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search videos..."
                className="w-full py-3 bg-transparent text-text-color focus:outline-none"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={isLoading}
              className="px-6 bg-surface-color hover:bg-background-color border border-border-color rounded-full transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 text-red-600 bg-red-50">
            {error}
          </div>
        )}

        {/* Search Results */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-1 gap-4">
            {searchResults.map((video) => (
              <div
                key={video.id}
                className="flex gap-4 p-4 rounded-xl hover:bg-surface-color transition-colors cursor-pointer"
              >
                <div className="relative w-48 h-28 rounded-xl overflow-hidden flex-shrink-0">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 right-2 px-1 py-0.5 bg-black/80 text-white text-xs rounded">
                    4:15
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-lg line-clamp-2 text-text-color mb-2">{video.title}</h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSavedVideos(prev => [...prev, video])}
                      className="px-4 py-2 text-sm font-medium rounded-full transition-colors"
                      style={{
                        backgroundColor: 'var(--primary-color)',
                        color: 'white'
                      }}
                    >
                      Save to Library
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Saved Videos Sidebar */}
      <div className="w-72 border-l border-border-color flex flex-col bg-surface-color">
        <div className="p-4 border-b border-border-color">
          <h3 className="font-medium text-text-color flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            Library ({savedVideos.length})
          </h3>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {savedVideos.map((video) => (
              <div key={video.id} className="group">
                <div className="relative aspect-video rounded-xl overflow-hidden mb-2">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => setSavedVideos(prev => prev.filter(v => v.id !== video.id))}
                      className="text-white hover:text-red-500 transition-colors"
                    >
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                <h4 className="text-sm font-medium line-clamp-2 text-text-color">{video.title}</h4>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}; 