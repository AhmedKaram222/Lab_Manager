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
      patients: {
        Row: {
          id: string;
          created_at: string;
          name: string;
          age: number;
          gender: string;
          phone: string;
          file_code: string;
          doctor_id: string | null;
          notes: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          name: string;
          age: number;
          gender: string;
          phone: string;
          file_code: string;
          doctor_id?: string | null;
          notes?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          name?: string;
          age?: number;
          gender?: string;
          phone?: string;
          file_code?: string;
          doctor_id?: string | null;
          notes?: string | null;
        };
      };
      doctors: {
        Row: {
          id: string;
          created_at: string;
          name: string;
          specialty: string;
          phone: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          name: string;
          specialty: string;
          phone?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          name?: string;
          specialty?: string;
          phone?: string | null;
        };
      };
      tests: {
        Row: {
          id: string;
          created_at: string;
          name: string;
          price: number;
          description: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          name: string;
          price: number;
          description?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          name?: string;
          price?: number;
          description?: string | null;
        };
      };
      test_results: {
        Row: {
          id: string;
          created_at: string;
          patient_id: string;
          test_id: string;
          doctor_id: string | null;
          result_data: Json;
          status: string;
          notes: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          patient_id: string;
          test_id: string;
          doctor_id?: string | null;
          result_data: Json;
          status: string;
          notes?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          patient_id?: string;
          test_id?: string;
          doctor_id?: string | null;
          result_data?: Json;
          status?: string;
          notes?: string | null;
        };
      };
      users: {
        Row: {
          id: string;
          created_at: string;
          username: string;
          role: string;
          permissions: Json | null;
          auth_id: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          username: string;
          role: string;
          permissions?: Json | null;
          auth_id?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          username?: string;
          role?: string;
          permissions?: Json | null;
          auth_id?: string | null;
        };
      };
      lab_info: {
        Row: {
          id: string;
          created_at: string;
          lab_name: string;
          address: string;
          phone: string;
          email: string | null;
          logo: string | null;
          notes: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          lab_name: string;
          address: string;
          phone: string;
          email?: string | null;
          logo?: string | null;
          notes?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          lab_name?: string;
          address?: string;
          phone?: string;
          email?: string | null;
          logo?: string | null;
          notes?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
