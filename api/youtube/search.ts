import { NextApiRequest, NextApiResponse } from 'next';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { q: query, type = 'video', videoCategoryId } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    if (!YOUTUBE_API_KEY) {
      return res.status(500).json({ error: 'YouTube API key is not configured' });
    }

    const params = new URLSearchParams({
      part: 'snippet,contentDetails',
      maxResults: '10',
      q: Array.isArray(query) ? query[0] : query,
      type: Array.isArray(type) ? type[0] : type,
      key: YOUTUBE_API_KEY,
      ...(videoCategoryId && { videoCategoryId: Array.isArray(videoCategoryId) ? videoCategoryId[0] : videoCategoryId })
    });

    // For music searches, add music-specific parameters
    if (type === 'music') {
      params.append('videoCategoryId', '10'); // 10 is the category ID for Music
      params.append('videoEmbeddable', 'true');
    }

    const response = await fetch(`${YOUTUBE_API_URL}/search?${params}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'YouTube API request failed');
    }

    // Transform the response to include only necessary data
    const videos = await Promise.all(data.items.map(async (item: any) => {
      // Get video duration and additional details
      const videoResponse = await fetch(
        `${YOUTUBE_API_URL}/videos?part=contentDetails,statistics&id=${item.id.videoId}&key=${YOUTUBE_API_KEY}`
      );
      const videoData = await videoResponse.json();
      const videoDetails = videoData.items[0];

      return {
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.medium.url,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        duration: videoDetails?.contentDetails?.duration || 'PT0M0S',
        viewCount: videoDetails?.statistics?.viewCount || 0
      };
    }));

    return res.status(200).json(videos);
  } catch (error: any) {
    console.error('YouTube API error:', error);
    return res.status(500).json({ error: error.message });
  }
} 