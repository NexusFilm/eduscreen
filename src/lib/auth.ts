import { supabase } from './supabase';

export interface User {
  id: string;
  name: string;
  email: string;
  picture?: string;
}

export async function signInWithGoogle() {
  try {
    // Instead of directly calling Supabase, we'll go through our Vercel API route
    const response = await fetch('/api/auth/google/signin');
    if (!response.ok) {
      throw new Error('Failed to initiate Google sign-in');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
}

export async function signOut() {
  try {
    // Go through Vercel API route for sign out
    const response = await fetch('/api/auth/signout', { method: 'POST' });
    if (!response.ok) {
      throw new Error('Failed to sign out');
    }
    return await response.json();
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    // Get user through Vercel API route
    const response = await fetch('/api/auth/user');
    if (!response.ok) {
      if (response.status === 401) return null;
      throw new Error('Failed to get current user');
    }
    return await response.json();
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

export async function getUserProfile() {
  try {
    // Get profile through Vercel API route
    const response = await fetch('/api/auth/profile');
    if (!response.ok) {
      if (response.status === 401) return null;
      throw new Error('Failed to get user profile');
    }
    return await response.json();
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
} 