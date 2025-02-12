import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      throw error;
    }

    return res.status(200).json({ message: 'Signed out successfully' });
  } catch (error) {
    console.error('Error in signout API route:', error);
    return res.status(500).json({ error: 'Failed to sign out' });
  }
} 