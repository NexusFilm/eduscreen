import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../src/lib/supabase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
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

    // Redirect to the OAuth provider
    return res.redirect(302, data.url);
  } catch (error: any) {
    console.error('Sign-in error:', error);
    return res.status(500).json({ error: error.message });
  }
} 