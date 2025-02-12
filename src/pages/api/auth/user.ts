import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the session from the request
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Map Supabase user data to our User interface
    const userData = {
      id: user.id,
      name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
      email: user.email || '',
      picture: user.user_metadata?.avatar_url || user.user_metadata?.picture
    };

    return res.status(200).json(userData);
  } catch (error) {
    console.error('Error in user API route:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 