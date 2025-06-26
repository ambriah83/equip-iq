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
      role_permissions: {
        Row: {
          created_at: string | null
          id: string
          is_allowed: boolean
          permission: Database["public"]["Enums"]["escalation_permission"]
          role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_allowed?: boolean
          permission: Database["public"]["Enums"]["escalation_permission"]
          role: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          created_at?: string | null
          id?: string
          is_allowed?: boolean
          permission?: Database["public"]["Enums"]["escalation_permission"]
          role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: []
      }
      user_permissions: {
        Row: {
          created_at: string | null
          custom_permissions_applied: boolean
          id: string
          is_allowed: boolean
          permission: Database["public"]["Enums"]["escalation_permission"]
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          custom_permissions_applied?: boolean
          id?: string
          is_allowed?: boolean
          permission: Database["public"]["Enums"]["escalation_permission"]
          role: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          custom_permissions_applied?: boolean
          id?: string
          is_allowed?: boolean
          permission?: Database["public"]["Enums"]["escalation_permission"]
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_permissions: {
        Args: {
          target_user_id: string
          user_role: Database["public"]["Enums"]["user_role"]
        }
        Returns: {
          permission: Database["public"]["Enums"]["escalation_permission"]
          is_allowed: boolean
          is_custom: boolean
        }[]
      }
      initialize_user_permissions: {
        Args: {
          target_user_id: string
          user_role: Database["public"]["Enums"]["user_role"]
        }
        Returns: undefined
      }
    }
    Enums: {
      escalation_permission:
        | "can_use_ladder"
        | "can_handle_electrical"
        | "can_disassemble_parts"
        | "can_work_at_height"
        | "can_handle_chemicals"
        | "can_operate_heavy_equipment"
        | "can_access_restricted_areas"
        | "can_perform_emergency_shutdowns"
      user_role: "owner" | "admin" | "manager" | "staff" | "vendor"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      escalation_permission: [
        "can_use_ladder",
        "can_handle_electrical",
        "can_disassemble_parts",
        "can_work_at_height",
        "can_handle_chemicals",
        "can_operate_heavy_equipment",
        "can_access_restricted_areas",
        "can_perform_emergency_shutdowns",
      ],
      user_role: ["owner", "admin", "manager", "staff", "vendor"],
    },
  },
} as const
