import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../../lib/supabase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Initiate Google OAuth through Supabase
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) throw error;

    if (!data.url) {
      throw new Error('No OAuth URL returned');
    }

    // Return the URL that the client should redirect to
    return res.status(200).json({ url: data.url });
  } catch (error) {
    console.error('Error in Google signin API route:', error);
    return res.status(500).json({ error: 'Failed to initiate Google sign-in' });
  }
} 