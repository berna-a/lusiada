export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          notes: string | null
          permissions: Json | null
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          notes?: string | null
          permissions?: Json | null
          role: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          notes?: string | null
          permissions?: Json | null
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      audit_log: {
        Row: {
          action: string
          changes: Json | null
          created_at: string | null
          id: string
          ip_address: string | null
          record_id: string | null
          table_name: string
          user_agent: string | null
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          changes?: Json | null
          created_at?: string | null
          id?: string
          ip_address?: string | null
          record_id?: string | null
          table_name: string
          user_agent?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          changes?: Json | null
          created_at?: string | null
          id?: string
          ip_address?: string | null
          record_id?: string | null
          table_name?: string
          user_agent?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      donations: {
        Row: {
          affected_figure_id: string | null
          affected_project_id: string | null
          affected_to: string | null
          amount_cents: number
          created_at: string | null
          currency: string
          display_name: string | null
          donor_email: string
          donor_message: string | null
          donor_name: string | null
          id: string
          is_public: boolean | null
          member_id: string | null
          payment_method: string | null
          payment_status: string | null
          receipt_sent: boolean | null
          receipt_sent_at: string | null
          stripe_charge_id: string | null
          stripe_payment_intent_id: string | null
          updated_at: string | null
        }
        Insert: {
          affected_figure_id?: string | null
          affected_project_id?: string | null
          affected_to?: string | null
          amount_cents: number
          created_at?: string | null
          currency?: string
          display_name?: string | null
          donor_email: string
          donor_message?: string | null
          donor_name?: string | null
          id?: string
          is_public?: boolean | null
          member_id?: string | null
          payment_method?: string | null
          payment_status?: string | null
          receipt_sent?: boolean | null
          receipt_sent_at?: string | null
          stripe_charge_id?: string | null
          stripe_payment_intent_id?: string | null
          updated_at?: string | null
        }
        Update: {
          affected_figure_id?: string | null
          affected_project_id?: string | null
          affected_to?: string | null
          amount_cents?: number
          created_at?: string | null
          currency?: string
          display_name?: string | null
          donor_email?: string
          donor_message?: string | null
          donor_name?: string | null
          id?: string
          is_public?: boolean | null
          member_id?: string | null
          payment_method?: string | null
          payment_status?: string | null
          receipt_sent?: boolean | null
          receipt_sent_at?: string | null
          stripe_charge_id?: string | null
          stripe_payment_intent_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "donations_affected_figure_id_fkey"
            columns: ["affected_figure_id"]
            isOneToOne: false
            referencedRelation: "figures"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donations_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      figure_content_blocks: {
        Row: {
          attribution: string | null
          block_type: string
          content: string | null
          created_at: string | null
          display_order: number
          figure_id: string
          id: string
          image_caption: string | null
          image_url: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          attribution?: string | null
          block_type: string
          content?: string | null
          created_at?: string | null
          display_order?: number
          figure_id: string
          id?: string
          image_caption?: string | null
          image_url?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          attribution?: string | null
          block_type?: string
          content?: string | null
          created_at?: string | null
          display_order?: number
          figure_id?: string
          id?: string
          image_caption?: string | null
          image_url?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "figure_content_blocks_figure_id_fkey"
            columns: ["figure_id"]
            isOneToOne: false
            referencedRelation: "figures"
            referencedColumns: ["id"]
          },
        ]
      }
      figures: {
        Row: {
          attributes: string[] | null
          birth_year: string | null
          category: string | null
          created_at: string | null
          death_year: string | null
          display_order: number | null
          epithet: string | null
          era: string | null
          hero_image_url: string | null
          id: string
          is_figure_of_year: boolean | null
          is_published: boolean | null
          name: string
          portrait_url: string | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          attributes?: string[] | null
          birth_year?: string | null
          category?: string | null
          created_at?: string | null
          death_year?: string | null
          display_order?: number | null
          epithet?: string | null
          era?: string | null
          hero_image_url?: string | null
          id?: string
          is_figure_of_year?: boolean | null
          is_published?: boolean | null
          name: string
          portrait_url?: string | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          attributes?: string[] | null
          birth_year?: string | null
          category?: string | null
          created_at?: string | null
          death_year?: string | null
          display_order?: number | null
          epithet?: string | null
          era?: string | null
          hero_image_url?: string | null
          id?: string
          is_figure_of_year?: boolean | null
          is_published?: boolean | null
          name?: string
          portrait_url?: string | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      members: {
        Row: {
          birth_year: number | null
          city: string | null
          country: string | null
          created_at: string | null
          district: string | null
          email: string
          email_verification_sent_at: string | null
          email_verified: boolean | null
          events_consent: boolean | null
          full_name: string
          how_did_you_find_us: string | null
          id: string
          joined_at: string | null
          motivation: string | null
          newsletter_consent: boolean | null
          phone: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          birth_year?: number | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          district?: string | null
          email: string
          email_verification_sent_at?: string | null
          email_verified?: boolean | null
          events_consent?: boolean | null
          full_name: string
          how_did_you_find_us?: string | null
          id?: string
          joined_at?: string | null
          motivation?: string | null
          newsletter_consent?: boolean | null
          phone?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          birth_year?: number | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          district?: string | null
          email?: string
          email_verification_sent_at?: string | null
          email_verified?: boolean | null
          events_consent?: boolean | null
          full_name?: string
          how_did_you_find_us?: string | null
          id?: string
          joined_at?: string | null
          motivation?: string | null
          newsletter_consent?: boolean | null
          phone?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      memories: {
        Row: {
          attachments_urls: string[] | null
          content: string | null
          created_at: string | null
          id: string
          is_public: boolean | null
          member_id: string | null
          memory_type: string | null
          related_location: string | null
          related_period: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
          submitter_email: string
          submitter_name: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          attachments_urls?: string[] | null
          content?: string | null
          created_at?: string | null
          id?: string
          is_public?: boolean | null
          member_id?: string | null
          memory_type?: string | null
          related_location?: string | null
          related_period?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          submitter_email: string
          submitter_name?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          attachments_urls?: string[] | null
          content?: string | null
          created_at?: string | null
          id?: string
          is_public?: boolean | null
          member_id?: string | null
          memory_type?: string | null
          related_location?: string | null
          related_period?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          submitter_email?: string
          submitter_name?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "memories_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      pages: {
        Row: {
          content_markdown: string | null
          created_at: string | null
          display_order: number | null
          hero_image_url: string | null
          id: string
          is_published: boolean | null
          meta_description: string | null
          meta_keywords: string | null
          slug: string
          subtitle: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          content_markdown?: string | null
          created_at?: string | null
          display_order?: number | null
          hero_image_url?: string | null
          id?: string
          is_published?: boolean | null
          meta_description?: string | null
          meta_keywords?: string | null
          slug: string
          subtitle?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          content_markdown?: string | null
          created_at?: string | null
          display_order?: number | null
          hero_image_url?: string | null
          id?: string
          is_published?: boolean | null
          meta_description?: string | null
          meta_keywords?: string | null
          slug?: string
          subtitle?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      works: {
        Row: {
          author_figure_id: string | null
          author_name: string | null
          content_markdown: string | null
          cover_image_url: string | null
          created_at: string | null
          description: string | null
          display_order: number | null
          external_url: string | null
          id: string
          is_published: boolean | null
          publication_year: string | null
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          author_figure_id?: string | null
          author_name?: string | null
          content_markdown?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          external_url?: string | null
          id?: string
          is_published?: boolean | null
          publication_year?: string | null
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          author_figure_id?: string | null
          author_name?: string | null
          content_markdown?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          external_url?: string | null
          id?: string
          is_published?: boolean | null
          publication_year?: string | null
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "works_author_figure_id_fkey"
            columns: ["author_figure_id"]
            isOneToOne: false
            referencedRelation: "figures"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
      unaccent: { Args: { "": string }; Returns: string }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
