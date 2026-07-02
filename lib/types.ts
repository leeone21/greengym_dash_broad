export type Program = '블로그체험단' | '1:1 PT' | '요가' | '그룹PT' | '구독' | '헬스'

export interface RenewalMember {
  id: string
  member_name: string
  program: Program
  expire_date: string
  last_visit_date: string | null
  total_visits: number
  renewal_probability: number
  contacted_kakao: boolean
  contacted_sms: boolean
  contacted_call: boolean
  contacted_visit: boolean
  memo: string | null
  target_month: string
  note: string | null
  created_at: string
  updated_at: string
}

export interface DashboardStats {
  expiring_count: number
  renewed_count: number
  renewal_rate: number
  avg_probability: number
}

export interface MonthlyRevenue {
  month: string
  헬스: number
  요가: number
  그룹PT: number
  PT: number
  구독: number
}

export interface RenewalRate {
  month: string
  rate: number
}
