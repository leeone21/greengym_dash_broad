import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

const julyMembers = [
  { member_name: '김민지', program: '1:1 PT', expire_date: '2025-07-05', last_visit_date: '2025-06-28', total_visits: 24, renewal_probability: 85 },
  { member_name: '박서준', program: '헬스', expire_date: '2025-07-08', last_visit_date: '2025-07-01', total_visits: 45, renewal_probability: 70 },
  { member_name: '이수아', program: '요가', expire_date: '2025-07-10', last_visit_date: '2025-06-30', total_visits: 18, renewal_probability: 60 },
  { member_name: '최준혁', program: '그룹PT', expire_date: '2025-07-12', last_visit_date: '2025-06-25', total_visits: 32, renewal_probability: 50 },
  { member_name: '정하늘', program: '구독', expire_date: '2025-07-15', last_visit_date: '2025-07-02', total_visits: 8, renewal_probability: 75 },
  { member_name: '강민호', program: '헬스', expire_date: '2025-07-18', last_visit_date: '2025-06-20', total_visits: 12, renewal_probability: 40 },
  { member_name: '윤소희', program: '1:1 PT', expire_date: '2025-07-20', last_visit_date: '2025-07-01', total_visits: 36, renewal_probability: 90 },
  { member_name: '임재원', program: '그룹PT', expire_date: '2025-07-22', last_visit_date: '2025-06-28', total_visits: 20, renewal_probability: 65 },
  { member_name: '한지아', program: '요가', expire_date: '2025-07-25', last_visit_date: '2025-07-03', total_visits: 28, renewal_probability: 80 },
  { member_name: '오동현', program: '블로그체험단', expire_date: '2025-07-28', last_visit_date: '2025-06-15', total_visits: 5, renewal_probability: 30 },
  { member_name: '송유나', program: '헬스', expire_date: '2025-07-30', last_visit_date: '2025-07-04', total_visits: 52, renewal_probability: 85 },
  { member_name: '배성민', program: '구독', expire_date: '2025-07-31', last_visit_date: '2025-06-30', total_visits: 15, renewal_probability: 55 },
]

async function seed() {
  console.log('Seeding July 2025 members...')

  const rows = julyMembers.map((m) => ({
    ...m,
    target_month: '2025-07',
    contacted_kakao: false,
    contacted_sms: false,
    contacted_call: false,
    contacted_visit: false,
  }))

  const { data, error } = await supabase.from('renewal_tracking').insert(rows).select()

  if (error) {
    console.error('Error seeding:', error)
    return
  }

  console.log(`Seeded ${data.length} members successfully!`)
}

seed()
