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
      equipment: {
        Row: {
          created_at: string
          equipment_photo_url: string | null
          equipment_type_id: string
          id: string
          last_service_date: string | null
          location_id: string
          name: string
          room_id: string | null
          room_layout_url: string | null
          room_photo_url: string | null
          serial_number: string | null
          status: string
          tmax_connection: string | null
          updated_at: string
          warranty_expiry_date: string | null
          warranty_status: string
        }
        Insert: {
          created_at?: string
          equipment_photo_url?: string | null
          equipment_type_id: string
          id?: string
          last_service_date?: string | null
          location_id: string
          name: string
          room_id?: string | null
          room_layout_url?: string | null
          room_photo_url?: string | null
          serial_number?: string | null
          status?: string
          tmax_connection?: string | null
          updated_at?: string
          warranty_expiry_date?: string | null
          warranty_status?: string
        }
        Update: {
          created_at?: string
          equipment_photo_url?: string | null
          equipment_type_id?: string
          id?: string
          last_service_date?: string | null
          location_id?: string
          name?: string
          room_id?: string | null
          room_layout_url?: string | null
          room_photo_url?: string | null
          serial_number?: string | null
          status?: string
          tmax_connection?: string | null
          updated_at?: string
          warranty_expiry_date?: string | null
          warranty_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "equipment_equipment_type_id_fkey"
            columns: ["equipment_type_id"]
            isOneToOne: false
            referencedRelation: "equipment_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equipment_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equipment_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      equipment_logs: {
        Row: {
          cost: number | null
          created_at: string
          description: string | null
          equipment_id: string
          id: string
          log_type: string
          next_service_date: string | null
          parts_used: string[] | null
          performed_by: string | null
          title: string
        }
        Insert: {
          cost?: number | null
          created_at?: string
          description?: string | null
          equipment_id: string
          id?: string
          log_type: string
          next_service_date?: string | null
          parts_used?: string[] | null
          performed_by?: string | null
          title: string
        }
        Update: {
          cost?: number | null
          created_at?: string
          description?: string | null
          equipment_id?: string
          id?: string
          log_type?: string
          next_service_date?: string | null
          parts_used?: string[] | null
          performed_by?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "equipment_logs_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
        ]
      }
      equipment_types: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      knowledge_base: {
        Row: {
          content: string | null
          created_at: string
          document_type: string
          equipment_id: string
          file_url: string | null
          id: string
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          document_type: string
          equipment_id: string
          file_url?: string | null
          id?: string
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          content?: string | null
          created_at?: string
          document_type?: string
          equipment_id?: string
          file_url?: string | null
          id?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_base_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          abbreviation: string
          address: string | null
          created_at: string
          email: string | null
          id: string
          manager_name: string | null
          name: string
          notes: string | null
          phone: string | null
          status: string
          updated_at: string
        }
        Insert: {
          abbreviation: string
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          manager_name?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          abbreviation?: string
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          manager_name?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
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
      rooms: {
        Row: {
          capacity: number | null
          created_at: string
          description: string | null
          floor_number: number | null
          id: string
          location_id: string
          name: string
          room_type: string | null
          status: string
          updated_at: string
        }
        Insert: {
          capacity?: number | null
          created_at?: string
          description?: string | null
          floor_number?: number | null
          id?: string
          location_id: string
          name: string
          room_type?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          capacity?: number | null
          created_at?: string
          description?: string | null
          floor_number?: number | null
          id?: string
          location_id?: string
          name?: string
          room_type?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rooms_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_location_access: {
        Row: {
          access_level: string
          granted_at: string
          granted_by: string | null
          id: string
          location_id: string
          user_id: string
        }
        Insert: {
          access_level?: string
          granted_at?: string
          granted_by?: string | null
          id?: string
          location_id: string
          user_id: string
        }
        Update: {
          access_level?: string
          granted_at?: string
          granted_by?: string | null
          id?: string
          location_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_location_access_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
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
      vendors: {
        Row: {
          company_name: string
          contact_name: string | null
          created_at: string
          equipment_name: string | null
          equipment_type: string
          id: string
          notes: string | null
          phone: string | null
          updated_at: string
          vendor_department: string | null
          website_email: string | null
        }
        Insert: {
          company_name: string
          contact_name?: string | null
          created_at?: string
          equipment_name?: string | null
          equipment_type: string
          id?: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
          vendor_department?: string | null
          website_email?: string | null
        }
        Update: {
          company_name?: string
          contact_name?: string | null
          created_at?: string
          equipment_name?: string | null
          equipment_type?: string
          id?: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
          vendor_department?: string | null
          website_email?: string | null
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
