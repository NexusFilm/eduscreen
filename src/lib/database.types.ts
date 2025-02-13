export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      classes: {
        Row: {
          id: string
          name: string
          user_id: string
          theme: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          user_id: string
          theme?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          user_id?: string
          theme?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      documents: {
        Row: {
          id: string
          title: string
          content: Json | null
          class_id: string
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content?: Json | null
          class_id: string
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: Json | null
          class_id?: string
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      media: {
        Row: {
          id: string
          storage_path: string
          original_name: string
          mime_type: string | null
          size: number | null
          document_id: string | null
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          storage_path: string
          original_name: string
          mime_type?: string | null
          size?: number | null
          document_id?: string | null
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          storage_path?: string
          original_name?: string
          mime_type?: string | null
          size?: number | null
          document_id?: string | null
          user_id?: string
          created_at?: string
        }
      }
      widgets: {
        Row: {
          id: string
          type: string
          config: Json | null
          position: Json | null
          document_id: string
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          type: string
          config?: Json | null
          position?: Json | null
          document_id: string
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          type?: string
          config?: Json | null
          position?: Json | null
          document_id?: string
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 