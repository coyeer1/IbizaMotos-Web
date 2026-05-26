export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      blog_posts: {
        Row: {
          body: string[]
          category: string
          created_at: string
          date: string
          excerpt: string
          featured: boolean
          id: number
          image: string
          likes: number
          read_time: string
          tags: string[]
          title: string
          updated_at: string
          views: number
        }
        Insert: {
          body?: string[]
          category: string
          created_at?: string
          date: string
          excerpt: string
          featured?: boolean
          id: number
          image: string
          likes?: number
          read_time: string
          tags?: string[]
          title: string
          updated_at?: string
          views?: number
        }
        Update: {
          body?: string[]
          category?: string
          created_at?: string
          date?: string
          excerpt?: string
          featured?: boolean
          id?: number
          image?: string
          likes?: number
          read_time?: string
          tags?: string[]
          title?: string
          updated_at?: string
          views?: number
        }
        Relationships: []
      }
      motorcycles: {
        Row: {
          brand: string
          category: string
          created_at: string
          description: string
          featured: boolean
          id: string
          images: string[]
          images_by_color: Json | null
          model: string
          price: number
          specifications: Json
          stock: string | null
          updated_at: string
          video_url: string | null
          year: number
        }
        Insert: {
          brand: string
          category: string
          created_at?: string
          description: string
          featured?: boolean
          id: string
          images?: string[]
          images_by_color?: Json | null
          model: string
          price: number
          specifications?: Json
          stock?: string | null
          updated_at?: string
          video_url?: string | null
          year: number
        }
        Update: {
          brand?: string
          category?: string
          created_at?: string
          description?: string
          featured?: boolean
          id?: string
          images?: string[]
          images_by_color?: Json | null
          model?: string
          price?: number
          specifications?: Json
          stock?: string | null
          updated_at?: string
          video_url?: string | null
          year?: number
        }
        Relationships: []
      }
      workshop_appointments: {
        Row: {
          appt_date: string
          appt_time: string
          branch_address: string | null
          branch_name: string | null
          created_at: string | null
          email: string | null
          id: string
          motorcycle: string | null
          name: string
          notes: string | null
          phone: string
          service: string
          status: string
        }
        Insert: {
          appt_date: string
          appt_time: string
          branch_address?: string | null
          branch_name?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          motorcycle?: string | null
          name: string
          notes?: string | null
          phone: string
          service: string
          status?: string
        }
        Update: {
          appt_date?: string
          appt_time?: string
          branch_address?: string | null
          branch_name?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          motorcycle?: string | null
          name?: string
          notes?: string | null
          phone?: string
          service?: string
          status?: string
        }
        Relationships: []
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']

export type TablesUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']
