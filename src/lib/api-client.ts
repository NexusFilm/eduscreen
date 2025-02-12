interface Track {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  duration: number;
}

interface ApiClientConfig {
  baseUrl?: string;
  apiKey?: string;
}

class ApiClient {
  private baseUrl: string;
  private apiKey?: string;

  constructor(config: ApiClientConfig = {}) {
    this.baseUrl = config.baseUrl || '/api';
    this.apiKey = config.apiKey;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(this.apiKey && { 'X-API-Key': this.apiKey }),
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  async searchMusic(query: string): Promise<{ tracks: Track[] }> {
    return this.request('/music/search', {
      method: 'POST',
      body: JSON.stringify({ query }),
    });
  }

  async getRadioTracks(trackId: string): Promise<Track[]> {
    return this.request(`/radio/tracks/${trackId}`);
  }
}

export default new ApiClient(); 