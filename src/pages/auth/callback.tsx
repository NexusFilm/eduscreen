import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Exchange the code for a session
        const { data, error } = await supabase.auth.exchangeCodeForSession(
          window.location.hash
        );
        
        if (error) {
          console.error('Auth callback error:', error.message);
          navigate('/login?error=' + encodeURIComponent(error.message));
          return;
        }

        if (data?.session) {
          // Successfully authenticated
          console.log('Authentication successful');
          navigate('/'); // Redirect to home page
        } else {
          // No session found
          navigate('/login?error=No session found');
        }
      } catch (error) {
        console.error('Unexpected error during auth:', error);
        navigate('/login?error=Unexpected error during authentication');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Completing sign in...</h2>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
      </div>
    </div>
  );
} 