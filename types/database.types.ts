/** Placeholder / hand-maintained. Regenerate with: `supabase gen types typescript --linked > types/database.types.ts` */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string | null;
          first_name: string | null;
          last_name: string | null;
          description: string | null;
          avatar_url: string | null;
          updated_at: string | null;
          created_at: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]> & {
          id: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
        Relationships: [];
      };
      posts: {
        Row: {
          id: string;
          user_id: string;
          text: string | null;
          pictures: unknown | null;
          reply_to: string | null;
          type: string | null;
          edited: boolean | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["posts"]["Row"]> & {
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["posts"]["Row"]>;
        Relationships: [];
      };
      following: {
        Row: {
          follower_id: string;
          following_id: string;
          created_at?: string | null;
        };
        Insert: Database["public"]["Tables"]["following"]["Row"];
        Update: Partial<Database["public"]["Tables"]["following"]["Row"]>;
        Relationships: [];
      };
      bookmark: {
        Row: {
          post_id: string;
          user_id: string;
          created_at?: string | null;
        };
        Insert: Database["public"]["Tables"]["bookmark"]["Row"];
        Update: Partial<Database["public"]["Tables"]["bookmark"]["Row"]>;
        Relationships: [];
      };
      likes: {
        Row: {
          post_id: string;
          user_id: string;
          created_at?: string | null;
        };
        Insert: Database["public"]["Tables"]["likes"]["Row"];
        Update: Partial<Database["public"]["Tables"]["likes"]["Row"]>;
        Relationships: [];
      };
      reply: {
        Row: {
          id: string;
          user_id: string;
          text: string | null;
          created_at?: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["reply"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["reply"]["Row"]>;
        Relationships: [];
      };
    };
    Views: {
      posts_with_meta: {
        Row: {
          id: string;
          user_id: string;
          text: string | null;
          pictures: unknown | null;
          reply_to: string | null;
          type: string | null;
          edited: boolean | null;
          created_at: string;
          author: Database["public"]["Tables"]["profiles"]["Row"] | null;
          like_count: number;
          reply_count: number;
          repost_count: number;
          bookmark_count: number;
          i_replied: boolean;
        };
        Relationships: [];
      };
    };
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
