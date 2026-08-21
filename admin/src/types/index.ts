export interface DashboardStats {
  total_users: number
  total_quotes: number
  users_with_quotes: number
  conversion_rate: number
  pending_quotes: number
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
}

export interface QuoteRow {
  id: number
  service?: string
  service_name?: string
  full_name?: string
  email?: string
  phone?: string | null
  user_id?: number
  project_type: string | null
  shooting_duration: string | null
  needs_drone: number
  delivery_time: string | null
  estimated_price: string | null
  status: 'draft' | 'generated' | 'cancelled'
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
