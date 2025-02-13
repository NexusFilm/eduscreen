import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Helper functions for auth
export const auth = {
  signIn: async (provider: 'google') => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
    return { data, error };
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  getSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    return { session, error };
  }
};

// Helper functions for storage
export const storage = {
  uploadFile: async (file: File, path: string) => {
    const { data, error } = await supabase.storage
      .from('media')
      .upload(path, file);
    return { data, error };
  },

  deleteFile: async (path: string) => {
    const { error } = await supabase.storage
      .from('media')
      .remove([path]);
    return { error };
  },

  getPublicUrl: (path: string) => {
    const { data } = supabase.storage
      .from('media')
      .getPublicUrl(path);
    return data.publicUrl;
  }
};

// Helper functions for database operations
export const db = {
  classes: {
    get: async () => {
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .order('created_at', { ascending: false });
      return { data, error };
    },

    create: async (name: string, theme?: string) => {
      const { data, error } = await supabase
        .from('classes')
        .insert([{ name, theme }])
        .select();
      return { data, error };
    },

    update: async (id: string, updates: { name?: string; theme?: string }) => {
      const { data, error } = await supabase
        .from('classes')
        .update(updates)
        .eq('id', id)
        .select();
      return { data, error };
    },

    delete: async (id: string) => {
      const { error } = await supabase
        .from('classes')
        .delete()
        .eq('id', id);
      return { error };
    }
  },

  documents: {
    get: async (classId: string) => {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('class_id', classId)
        .order('created_at', { ascending: false });
      return { data, error };
    },

    create: async (title: string, classId: string, content?: any) => {
      const { data, error } = await supabase
        .from('documents')
        .insert([{ title, class_id: classId, content }])
        .select();
      return { data, error };
    },

    update: async (id: string, updates: { title?: string; content?: any }) => {
      const { data, error } = await supabase
        .from('documents')
        .update(updates)
        .eq('id', id)
        .select();
      return { data, error };
    },

    delete: async (id: string) => {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id);
      return { error };
    }
  },

  widgets: {
    get: async (documentId: string) => {
      const { data, error } = await supabase
        .from('widgets')
        .select('*')
        .eq('document_id', documentId)
        .order('created_at', { ascending: true });
      return { data, error };
    },

    create: async (documentId: string, type: string, config?: any, position?: any) => {
      const { data, error } = await supabase
        .from('widgets')
        .insert([{ document_id: documentId, type, config, position }])
        .select();
      return { data, error };
    },

    update: async (id: string, updates: { config?: any; position?: any }) => {
      const { data, error } = await supabase
        .from('widgets')
        .update(updates)
        .eq('id', id)
        .select();
      return { data, error };
    },

    delete: async (id: string) => {
      const { error } = await supabase
        .from('widgets')
        .delete()
        .eq('id', id);
      return { error };
    }
  }
};

// Types for our database tables
export interface DbUser {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  created_at: string;
}

export interface DbClass {
  id: string;
  name: string;
  theme: string;
  user_id: string;
  created_at: string;
}

export interface DbWidget {
  id: string;
  class_id: string;
  type: string;
  label?: string;
  position?: { x: number; y: number };
  size?: string;
  is_core: boolean;
  settings?: any;
  created_at: string;
}

export interface DbNote {
  id: string;
  widget_id: string;
  content: string;
  color?: string;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface DbDocument {
  id: string;
  user_id: string;
  title: string;
  content?: string;
  file_url?: string;
  file_type?: string;
  created_at: string;
  updated_at: string;
} 