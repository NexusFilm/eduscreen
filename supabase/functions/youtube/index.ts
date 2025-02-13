// @ts-ignore: Deno types
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RequestBody {
  action: string;
  query?: string;
  videoId?: string;
}

// Simple in-memory rate limiting
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS = 30; // 30 requests per minute
const requestLog = new Map<string, number[]>();

function isRateLimited(userId: string): boolean {
  const now = Date.now();
  const userRequests = requestLog.get(userId) || [];
  
  // Clean old requests
  const recentRequests = userRequests.filter(time => now - time < RATE_LIMIT_WINDOW);
  requestLog.set(userId, recentRequests);
  
  if (recentRequests.length >= MAX_REQUESTS) {
    return true;
  }
  
  // Log new request
  recentRequests.push(now);
  return false;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabase = createClient(
      // @ts-ignore: Deno env
      Deno.env.get('SUPABASE_URL') ?? '',
      // @ts-ignore: Deno env
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Verify authentication
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      throw new Error('Unauthorized')
    }

    // Check rate limiting
    if (isRateLimited(user.id)) {
      throw new Error('Rate limit exceeded. Please try again later.')
    }

    const { action, query, videoId } = await req.json() as RequestBody
    // @ts-ignore: Deno env
    const YOUTUBE_API_KEY = Deno.env.get('YOUTUBE_API_KEY')

    if (!YOUTUBE_API_KEY) {
      throw new Error('YouTube API key not configured')
    }

    switch (action) {
      case 'SEARCH':
        if (!query) {
          throw new Error('Search query is required')
        }

        const searchResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${encodeURIComponent(
            query
          )}&type=video&key=${YOUTUBE_API_KEY}`
        )

        if (!searchResponse.ok) {
          const error = await searchResponse.json()
          throw new Error(error.error?.message || 'Failed to fetch videos')
        }

        const searchData = await searchResponse.json()
        
        // Store search history in Supabase
        await supabase
          .from('youtube_searches')
          .insert({
            user_id: user.id,
            query: query,
            results_count: searchData.items?.length || 0
          })
        
        return new Response(
          JSON.stringify(searchData),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      case 'GET_VIDEO_DETAILS':
        if (!videoId) {
          throw new Error('Video ID is required')
        }

        const detailsResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=${YOUTUBE_API_KEY}`
        )

        if (!detailsResponse.ok) {
          const error = await detailsResponse.json()
          throw new Error(error.error?.message || 'Failed to fetch video details')
        }

        const detailsData = await detailsResponse.json()
        
        return new Response(
          JSON.stringify(detailsData),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      default:
        throw new Error('Unknown action')
    }
  } catch (error) {
    console.error('Error in YouTube Edge Function:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const statusCode = errorMessage.includes('Unauthorized') ? 401 :
                      errorMessage.includes('Rate limit') ? 429 : 400
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        status: statusCode 
      }),
      { 
        status: statusCode,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
}) 