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
    const code = req.query.code as string;
    if (!code) {
      throw new Error('No code provided');
    }

    // Exchange the code for a session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) throw error;

    // Redirect to the home page or a success page
    res.redirect(302, '/');
  } catch (error) {
    console.error('Error in Google callback:', error);
    res.redirect(302, '/auth/error');
  }
} 