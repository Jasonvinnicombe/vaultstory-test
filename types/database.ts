export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          birthday: string | null;
          timezone: string | null;
          notification_preferences: Json | null;
          is_admin: boolean;
          membership_plan: string;
          membership_status: string;
          storage_quota_gb: number | null;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          stripe_price_id: string | null;
          stripe_current_period_end: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          birthday?: string | null;
          timezone?: string | null;
          notification_preferences?: Json | null;
          is_admin?: boolean;
          membership_plan?: string;
          membership_status?: string;
          storage_quota_gb?: number | null;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          stripe_price_id?: string | null;
          stripe_current_period_end?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          birthday?: string | null;
          timezone?: string | null;
          notification_preferences?: Json | null;
          is_admin?: boolean;
          membership_plan?: string;
          membership_status?: string;
          storage_quota_gb?: number | null;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          stripe_price_id?: string | null;
          stripe_current_period_end?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      vaults: {
        Row: {
          id: string;
          owner_user_id: string;
          name: string;
          vault_type: string;
          subject_name: string | null;
          subject_birthdate: string | null;
          description: string | null;
          cover_image_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          owner_user_id: string;
          name: string;
          vault_type: string;
          subject_name?: string | null;
          subject_birthdate?: string | null;
          description?: string | null;
          cover_image_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          owner_user_id?: string;
          name?: string;
          vault_type?: string;
          subject_name?: string | null;
          subject_birthdate?: string | null;
          description?: string | null;
          cover_image_url?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      vault_members: {
        Row: {
          id: string;
          vault_id: string;
          user_id: string;
          role: string;
        };
        Insert: {
          id?: string;
          vault_id: string;
          user_id: string;
          role?: string;
        };
        Update: {
          id?: string;
          vault_id?: string;
          user_id?: string;
          role?: string;
        };
        Relationships: [];
      };
      vault_invites: {
        Row: {
          id: string;
          vault_id: string;
          email: string;
          role: string;
          invited_by_user_id: string;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          vault_id: string;
          email: string;
          role: string;
          invited_by_user_id: string;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          vault_id?: string;
          email?: string;
          role?: string;
          invited_by_user_id?: string;
          status?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      admin_invites: {
        Row: {
          id: string;
          email: string;
          invited_by_user_id: string;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          invited_by_user_id: string;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          invited_by_user_id?: string;
          status?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      vault_entries: {
        Row: {
          id: string;
          vault_id: string;
          user_id: string;
          title: string;
          content_text: string | null;
          entry_type: string;
          mood: string | null;
          unlock_type: string;
          unlock_at: string | null;
          milestone_label: string | null;
          prediction_text: string | null;
          reality_text: string | null;
          created_at: string;
          is_deleted: boolean | null;
          milestone_achieved_at: string | null;
        };
        Insert: {
          id?: string;
          vault_id: string;
          user_id: string;
          title: string;
          content_text?: string | null;
          entry_type: string;
          mood?: string | null;
          unlock_type: string;
          unlock_at?: string | null;
          milestone_label?: string | null;
          prediction_text?: string | null;
          reality_text?: string | null;
          created_at?: string;
          is_deleted?: boolean | null;
          milestone_achieved_at?: string | null;
        };
        Update: {
          id?: string;
          vault_id?: string;
          user_id?: string;
          title?: string;
          content_text?: string | null;
          entry_type?: string;
          mood?: string | null;
          unlock_type?: string;
          unlock_at?: string | null;
          milestone_label?: string | null;
          prediction_text?: string | null;
          reality_text?: string | null;
          created_at?: string;
          is_deleted?: boolean | null;
          milestone_achieved_at?: string | null;
        };
        Relationships: [];
      };
      entry_assets: {
        Row: {
          id: string;
          entry_id: string;
          file_url: string;
          file_type: string;
        };
        Insert: {
          id?: string;
          entry_id: string;
          file_url: string;
          file_type: string;
        };
        Update: {
          id?: string;
          entry_id?: string;
          file_url?: string;
          file_type?: string;
        };
        Relationships: [];
      };
      entry_tags: {
        Row: {
          id: string;
          entry_id: string;
          tag: string;
        };
        Insert: {
          id?: string;
          entry_id: string;
          tag: string;
        };
        Update: {
          id?: string;
          entry_id?: string;
          tag?: string;
        };
        Relationships: [];
      };
      entry_unlock_notifications: {
        Row: {
          id: string;
          entry_id: string;
          recipient_user_id: string;
          recipient_email: string;
          sent_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          entry_id: string;
          recipient_user_id: string;
          recipient_email: string;
          sent_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          entry_id?: string;
          recipient_user_id?: string;
          recipient_email?: string;
          sent_at?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
