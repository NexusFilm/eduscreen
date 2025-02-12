import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { signInWithGoogle } from '../lib/auth';

export default function SupabaseTest() {
  const [status, setStatus] = useState('Loading...');
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check current auth status
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    // Test database connection
    async function testConnection() {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*');

        if (error) throw error;
        
        setStatus(`Connected to Supabase! Found ${data.length} users.`);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to connect to Supabase');
        setStatus('Failed');
      }
    }

    testConnection();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignIn = async () => {
    try {
      const { url } = await signInWithGoogle();
      // Supabase will handle the redirect
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in');
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign out');
    }
  };

  return (
    <div className="p-6 border rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Supabase Connection Test</h2>
      
      <div className="space-y-4">
        {/* Connection Status */}
        <div>
          <h3 className="font-medium mb-2">Database Connection:</h3>
          <p className={`${status === 'Failed' ? 'text-red-500' : 'text-green-500'}`}>
            {status}
          </p>
        </div>

        {/* Authentication Status */}
        <div>
          <h3 className="font-medium mb-2">Authentication Status:</h3>
          {user ? (
            <div className="space-y-2">
              <p className="text-green-500">Signed in as: {user.email}</p>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-gray-500">Not signed in</p>
              <button
                onClick={handleSignIn}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Sign in with Google
              </button>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
            <p className="text-red-600">Error: {error}</p>
          </div>
        )}
      </div>
    </div>
  );
} 