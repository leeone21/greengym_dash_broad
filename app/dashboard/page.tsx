'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import StatCard from '@/components/dashboard/StatCard'
import RevenueChart from '@/components/dashboard/RevenueChart'
import RenewalRateChart from '@/components/dashboard/RenewalRateChart'

export default function DashboardPage() {
  const [stats, setStats] = useState({
    expiring_count: 0,
    renewed_count: 0,
    renewal_rate: 0,
    avg_probability: 0,
  })

  useEffect(() => {
    const fetchStats = async () => {
      const now = new Date()
      const targetMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

      const { data } = await supabase
        .from('renewal_tracking')
        .select('renewal_probability, expire_date, contacted_kakao, contacted_sms, contacted_call, contacted_visit')
        .eq('target_month', targetMonth)

      if (!data) return

      const expiring = data.length
      const renewed = data.filter((m: { contacted_kakao: boolean; contacted_sms: boolean; contacted_call: boolean; contacted_visit: boolean }) =>
        m.contacted_kakao || m.contacted_sms || m.contacted_call || m.contacted_visit
      ).length
      const avgProb = expiring > 0
        ? Math.round(data.reduce((sum: number, m: { renewal_probability: number }) => sum + m.renewal_probability, 0) / expiring)
        : 0
      const rate = expiring > 0 ? Math.round((renewed / expiring) * 100) : 0

      setStats({ expiring_count: expiring, renewed_count: renewed, renewal_rate: rate, avg_probability: avgProb })
    }

    fetchStats()
  }, [])

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">대시보드</h1>
        <p style={{ color: '#8B8FA8' }} className="mt-1">이번 달 경영 현황을 확인하세요</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard title="이번 달 만료 예정" value={stats.expiring_count} subtitle="명" />
        <StatCard title="재등록 완료" value={stats.renewed_count} subtitle="명" accent />
        <StatCard title="재등록률" value={`${stats.renewal_rate}%`} />
        <StatCard title="평균 재등록 확률" value={`${stats.avg_probability}%`} />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <RevenueChart />
        <RenewalRateChart />
      </div>
    </div>
  )
}
