export interface DashboardStats {
  total_users: number
  total_quotes: number
  users_with_quotes: number
  users_with_appointments: number
  conversion_rate: number
  pending_quotes: number
  pending_appointments: number
  today_appointments: number
  new_messages: number
}

export interface AdminUser {
  id: number
  full_name: string
  email: string
  phone: string | null
  role: 'user' | 'admin'
  status: 'active' | 'inactive'
  created_at: string
  quote_count: number
  appointment_count: number
}

export interface UserDetailData {
  user: {
    id: number
    full_name: string
    email: string
    phone: string | null
    role: string
    status: string
    created_at: string
  }
  quotes: QuoteRow[]
  appointments: ApptRow[]
}

export interface QuoteRow {
  id: number
  quote_code: string | null
  service?: string
  service_name?: string
  full_name?: string
  email?: string
  user_id?: number
  project_type: string | null
  shooting_duration: string | null
  needs_drone: number
  delivery_time: string | null
  estimated_price: string | null
  status: 'draft' | 'generated' | 'scheduled' | 'cancelled'
  created_at: string
}

export interface ApptRow {
  id: number
  quote_id: number
  appointment_date: string
  start_time: string
  end_time: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  meeting_type: 'presencial' | 'virtual'
  notes: string | null
  created_at: string
  full_name?: string
  email?: string
  service_name?: string
  estimated_price?: string | null
}

export interface AvailSlot {
  id: number
  date: string
  start_time: string
  end_time: string
  is_available: number
  created_at: string
}

export interface BlockedDate {
  id: number
  date: string
  reason: string | null
  created_at: string
}

export interface ServiceRow {
  id: number
  name: string
  description: string
  base_price: string | null
  icon: string | null
  image_url: string | null
  active: number
}

export interface ContactMsg {
  id: number
  full_name: string
  email: string
  phone: string | null
  subject: string
  message: string
  status: 'new' | 'read' | 'archived' | 'answered'
  created_at: string
}
