import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../src/lib/supabase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'Code is required' });
  }

  try {
    const { data, error } = await supabase.auth.exchangeCodeForSession(String(code));

    if (error) throw error;

    // Create or update user profile
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .upsert({
        id: data.user.id,
        email: data.user.email,
        full_name: data.user.user_metadata.full_name,
        avatar_url: data.user.user_metadata.avatar_url,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (profileError) throw profileError;

    // Redirect to the app with the session
    res.redirect(302, `${process.env.NEXT_PUBLIC_APP_URL}?session=${data.session?.access_token}`);
  } catch (error: any) {
    console.error('Auth error:', error);
    res.redirect(302, `${process.env.NEXT_PUBLIC_APP_URL}/auth-error?error=${encodeURIComponent(error.message)}`);
  }
} 