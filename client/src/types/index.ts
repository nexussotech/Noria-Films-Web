export interface Service {
  id: number
  title: string
  description: string
  icon: string
  image_url: string
}

/** Servicio tal como llega del API */
export interface ApiService {
  id: number
  name: string
  description: string
  base_price: string
  icon: string
  image_url: string
  active: number
}

export interface Project {
  id: number
  title: string
  category: string
  cat: string
  image: string
}

export interface Feature {
  icon: string
  title: string
  desc: string
}

export interface Pillar {
  icon: string
  title: string
  desc: string
}

export interface Social {
  icon: string
  label: string
  href: string
}

export interface AuthUser {
  id: number
  full_name: string
  email: string
  role: 'user' | 'admin'
}

/** Cotización tal como la devuelve el API */
export interface QuoteItem {
  id: number
  quote_code: string | null
  user_id: number
  service_id: number
  service_name: string
  service_icon: string
  base_price: string
  shooting_duration: string | null
  needs_drone: number
  delivery_time: string | null
  project_type: string | null
  extra_notes: string | null
  production_cost: string
  equipment_cost: string
  postproduction_cost: string
  extras_cost: string
  estimated_price: string | null
  status: 'draft' | 'generated' | 'scheduled' | 'cancelled'
  created_at: string
  updated_at: string
}

/** Respuesta del POST /api/quotes */
export interface QuoteCreatedResponse {
  id: number
  quote_code: string | null
  status: string
  service_name: string
  base_price: number
  production_cost: number
  equipment_cost: number
  postproduction_cost: number
  extras_cost: number
  estimated_price: number
}

export interface Appointment {
  id: number
  quote_id: number
  service_name: string
  project_type: string | null
  appointment_date: string
  start_time: string
  end_time: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  meeting_type: 'presencial' | 'virtual'
  created_at: string
}

export interface AvailabilitySlot {
  id: number
  date: string       // 'YYYY-MM-DD'
  start_time: string // 'HH:MM:SS'
  end_time: string   // 'HH:MM:SS'
  is_available: number
}

export interface AppointmentCreatedResponse {
  id: number
  message: string
}

/** Configuración de precios del GET /api/quotes/pricing-config */
export interface PricingConfig {
  SHOOTING_DURATION_COST: Record<string, number>
  DELIVERY_TIME_COST:     Record<string, number>
  DRONE_COST:             number
}
