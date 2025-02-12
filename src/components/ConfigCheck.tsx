import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function ConfigCheck() {
  const [checks, setChecks] = useState({
    supabaseUrl: false,
    supabaseKey: false,
    googleAuth: false,
    youtubeApi: false,
    vercelUrl: false
  });

  useEffect(() => {
    // Check Supabase URL
    setChecks(c => ({
      ...c,
      supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL
    }));

    // Check Supabase Key
    setChecks(c => ({
      ...c,
      supabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    }));

    // Check Google Auth
    supabase.auth.getSession().then(({ data: { session } }) => {
      setChecks(c => ({
        ...c,
        googleAuth: !!session
      }));
    });

    // Check YouTube API
    setChecks(c => ({
      ...c,
      youtubeApi: !!process.env.YOUTUBE_API_KEY
    }));

    // Check Vercel URL
    setChecks(c => ({
      ...c,
      vercelUrl: !!process.env.NEXT_PUBLIC_APP_URL
    }));
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Configuration Check</h2>
      <div className="space-y-2">
        <div className="flex items-center">
          <span className={`w-4 h-4 rounded-full mr-2 ${checks.supabaseUrl ? 'bg-green-500' : 'bg-red-500'}`} />
          <span>Supabase URL: {checks.supabaseUrl ? 'Set' : 'Missing'}</span>
        </div>
        <div className="flex items-center">
          <span className={`w-4 h-4 rounded-full mr-2 ${checks.supabaseKey ? 'bg-green-500' : 'bg-red-500'}`} />
          <span>Supabase Key: {checks.supabaseKey ? 'Set' : 'Missing'}</span>
        </div>
        <div className="flex items-center">
          <span className={`w-4 h-4 rounded-full mr-2 ${checks.googleAuth ? 'bg-green-500' : 'bg-red-500'}`} />
          <span>Google Auth: {checks.googleAuth ? 'Connected' : 'Not Connected'}</span>
        </div>
        <div className="flex items-center">
          <span className={`w-4 h-4 rounded-full mr-2 ${checks.youtubeApi ? 'bg-green-500' : 'bg-red-500'}`} />
          <span>YouTube API: {checks.youtubeApi ? 'Set' : 'Missing'}</span>
        </div>
        <div className="flex items-center">
          <span className={`w-4 h-4 rounded-full mr-2 ${checks.vercelUrl ? 'bg-green-500' : 'bg-red-500'}`} />
          <span>Vercel URL: {checks.vercelUrl ? 'Set' : 'Missing'}</span>
        </div>
      </div>
    </div>
  );
} 